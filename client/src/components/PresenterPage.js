import React, { Component } from 'react';
import NavBar from './NavBar.js';
import Question from './Game/Question.js';
import io from "socket.io-client";
import axios from 'axios';
import correctSound from '../audio/correct.mp3'
import wrongSound from '../audio/wrong.mp3'

class PresenterPage extends Component {

	constructor() {
		super();
		this.state = {
			question: '',
			roomId: '',
			gameState: '',
			showAnswer: false,
			players: [],
			answerQueue: [],
			endpoint: "/",
		    mySocketId: "",
		    quiz: {},
		    currentQuestion: '',
		    currentAnswer: '',
		    currentQuestionNumber: 1
		};
		this.handleEnableBuzzer = this.handleEnableBuzzer.bind(this);
		this.handleDisableBuzzer = this.handleDisableBuzzer.bind(this);
		this.handleStartTimer = this.handleStartTimer.bind(this);
	}

	  componentDidMount() {
	    const { endpoint } = this.state;
	    this.socket = io(endpoint);
	    var r = this;

	    const token = localStorage.getItem('token');
		axios.get('/api/quizzes/' + window.location.pathname.split("/")[2], {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			const firstQuestion = res.data.quiz.questions[0];
			this.setState({quiz: res.data.quiz});
			this.setState({currentQuestion: firstQuestion.question, currentAnswer: firstQuestion.answer});
			// this.socket.emit('newQuestion', r.state.roomId ,r.state.currentQuestion);

		});

	    this.socket.emit('createNewQuiz');
	    this.socket.on('quizCreated', function(data){
	        console.log(data.roomId + " " + data.mySocketId);
	        r.setState({ 
	          roomId: data.roomId,
	          mySocketId: data.mySocketId
	        });
	      });
	    this.socket.on('playerJoinedRoom', function(data){
	      //console.log(data.playerName);
	      r.setState({ players: [
	      	{
	      		playerName: data.playerName,
	      		points: 0
	      	},

	      	...r.state.players] });
	      r.socket.emit('newQuestion', r.state.roomId ,r.state.currentQuestion);

	    });
	    //when someone clicks the button
	    this.socket.on('joinQuizQueue',function(data){
	    	console.log("PUSHED BUTTON: " + data.playerName);
	    	r.setState({ answerQueue: r.state.answerQueue.concat([data.playerName])});

	    });

	  }
	
	//updates the current question to the next, returns true if it can, false if not
	nextQuestion = () => {
		this.handleDisableBuzzer();
		if (this.state.quiz && this.state.currentQuestionNumber >= this.state.quiz.questions.length) {

			this.setState({
				answerQueue: [],
				players: this.state.players				
			});

			// should update mongo DB Participants
			// should load page of winners in table

			var r = this;
			this.state.players.forEach( function(player){
				r.socket.emit('gameOver', r.state.roomId, player.playerName, player.points);
			}
			);

		    const token = localStorage.getItem('token');
		    console.log("QUIZ ENDED, MONGO UPDATED");
			console.log(token);
			axios.patch('/api/quizzes/' + window.location.pathname.split("/")[2],
			 {
			 	participants: this.state.players,
			 	completed: true
			 },
			 {
				headers: {
					"x-auth": token
				}
			}).then((res) => {
				console.log(res);
				r.props.history.push("/gameover/" + window.location.pathname.split("/")[2]);

			});
			
			return false;
		}

		this.setState({
			currentQuestionNumber: this.state.currentQuestionNumber + 1,
			currentQuestion: this.state.quiz.questions[this.state.currentQuestionNumber].question,
			currentAnswer: this.state.quiz.questions[this.state.currentQuestionNumber].answer,
			answerQueue: [],
			players: this.state.players,
			showAnswer: false
		});
		r = this;
		this.socket.emit('newQuestion', r.state.roomId ,r.state.quiz.questions[r.state.currentQuestionNumber].question);

		return true;
	  }
	  
	nextPlayer = () => {
		// let audio = document.getElementById("wrong");
        // audio.play(); 
		this.handleStopTimer();
	 	if(this.state.answerQueue.length > 0){
			this.state.answerQueue.splice(0,1);
		    this.setState({
			  answerQueue: this.state.answerQueue
			});
	 	}
	 }

	showAnswer = () => {
	 	this.setState({showAnswer: true})
	}

	hideAnswer = () => {
	 	this.setState({showAnswer: false})
	}

	correctAnswer = () => {
		let audio = document.getElementById("correct");
        audio.play(); 
		this.handleStopTimer();

		// add points to first element in the list
	    if(this.state.answerQueue.length > 0){
			var index = this.state.players.map(function(e) { return e.playerName;}).indexOf(this.state.answerQueue[0]);
			const updatedPlayer = this.state.players[index];
			updatedPlayer.points++;
			this.setState({players: [
				...this.state.players.slice(0, index),
				updatedPlayer,
				...this.state.players.slice(index + 1)
				]})
		} 

		this.nextQuestion();
	}

	handleEnableBuzzer(e){
		e.preventDefault();
		var r = this;
	    this.socket.emit('enableBuzzer', r.state.roomId);
	}

	handleDisableBuzzer(e){
		var r = this;
	    this.socket.emit('disableBuzzer', r.state.roomId);
	}

	handleStartTimer(e){
		e.preventDefault();
		var r = this;
	    this.socket.emit('startTimer', r.state.roomId);
	}

	handleStopTimer(e){
		var r = this;
	    this.socket.emit('stopTimer', r.state.roomId);
	}

	renderPlayerList() {
		return (
			this.state.players.map((player, index) => {
				return (
					<li className="list-group-item justify-content-between d-flex" key={index}>
						{player.playerName}
						<span className="badge badge-default badge-pill">
						{player.points}
						</span>
					</li>
				)
			})
		)
	}

	renderAnswerQueue(){
		return(
			this.state.answerQueue.map(function(player, index){
		      return <li key={index}><b>{player}</b></li>
		    })
		)
	}

	render() {
		return ([
			<NavBar history={this.props.history} key="navbar"/>,
			<div className="container" key="container">
				<div className="row mt-5">
					<div className="col-md-3 col-5 ">
						<div className="card">
							<div className="card-body">
								<h5 className="">ROOM CODE: <b>{this.state.roomId}</b></h5>
							</div>
						</div>
						<div className="controls">
							<button className="btn btn-primary mt-3 col-md-12" 
								onClick={this.handleEnableBuzzer} >Enable Buzzing
							</button>
						</div>
						<div className="players-list mt-4">
							<h3 className="mb-3">Players</h3>
							<ul className="list-group ">
							  {this.state.players.length === 0 ? (<span className='grey-text'>There are currently no players</span>) : undefined}
							  {this.renderPlayerList()}
							</ul>
						</div>
					</div>
					<div className="col-md-9 col-7 ">
							<div className="col-12">
								<Question question={this.state.currentQuestion} key="x"/>
								{this.state.showAnswer ? <Question question={this.state.currentAnswer}/> : undefined}
								{this.renderAnswerQueue()}
								<div className="right-wrong-buttons mt-4 d-flex justify-content-between">
								<button className="btn btn-success btn-md col mr-4 " onClick={this.correctAnswer}><span aria-label="correct" role="img">✅</span></button>
								<button className="btn btn-danger btn-md col mr-4 " onClick={this.nextPlayer}><span aria-label="wrong" role="img">❌</span></button>
								</div>
								<div className="right-wrong-buttons mt-4 d-flex justify-content-between ">
								<button className="btn btn-info btn-md col mr-4" onClick={this.showAnswer}>Answer</button>
								<button className="btn btn-warning btn-md col mr-4" onClick={this.nextQuestion}>Skip</button>
								<button className="btn btn-primary btn-md col " onClick={this.handleStartTimer}>Timer</button>
								<audio id="correct" ><source src={correctSound} type="audio/mpeg" /></audio>
								<audio id="wrong" ><source src={wrongSound} type="audio/mpeg" /></audio>
								</div>
							</div>
					</div>
				</div>
			</div>
		])
	}
}

 export default PresenterPage;