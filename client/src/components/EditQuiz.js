import React, { Component } from 'react';
import axios from 'axios';
import QuestionInput from './QuestionInput.js';
import NavBar from './NavBar.js'

class EditQuiz extends Component {

	constructor() {
		super();
		this.state = {
			title: '',
			description: '',
            questions: [],
            quiz: {
            }
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.updateQuestion = this.updateQuestion.bind(this);
    }

    componentDidMount() {
		const token = localStorage.getItem('token');
		axios.get('/api/quizzes/' + window.location.pathname.split("/")[2], {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			this.setState({quiz: res.data.quiz});
			this.setState({questions: res.data.quiz.questions})
		});
    }

	handleSubmit(e) {
		//move questions into the quiz questions
		const updatedQuiz = Object.assign({}, this.state.quiz);
		updatedQuiz.questions = this.state.questions;
		console.log('updated quiz:');
		this.setState({quiz: updatedQuiz}, this.patchQuiz);
	}

	patchQuiz = () => {
		//timeout for any slow setState... uh refactor later
		setTimeout(() => {
			console.log('patching');
			const token = localStorage.getItem('token');
			let id = window.location.pathname.split("/")[2];
			axios.patch('/api/quizzes/' + id, {
				questions: this.state.quiz.questions
			}, {headers: {
				'x-auth': token
			}}).then((res) => {
				this.props.history.push("/quiz/" + id);
			});
		}, 100)
		
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value
		})
	}

	addQuestion() {
		var newQuestion = {
			key: Date.now(),
			question: '',
			answer: ''
		}
		this.setState((prevState) => ({quiz: {questions: [...prevState.quiz.questions, newQuestion]}}));
	}

	updateQuestion(key, question) {
		//console.log(key, question, "updating quesiton");
		var found = false;
		var newQuestions = this.state.questions.map(el => {
			if (el.key === key) {
				found = true;
				return Object.assign({}, el, question);
			}
			return el
		});
		if (!found) {
			this.setState(prevState => ({
				questions: [...prevState.questions, question]
			}))
		} else {
			this.setState({questions: newQuestions});
		}
	}

	removeQuestion = (id) => {
		this.setState({questions: this.state.questions.filter(e=>e.key!==id)});
	}

    renderQuestions = () => {
    	if (!this.state.quiz.questions) {
    		console.log('hd');
			return undefined;
		}
		return this.state.quiz.questions.map((question, i) => {
			return (
				<QuestionInput number={i + 1} key={question.key} id={question.key} question={question} updateQuestion={this.updateQuestion} removeQuestion={this.removeQuestion}/>
			)
		})
	}

	render() {
        const {title, description} = this.state.quiz;
		return ([
			<NavBar history={this.props.history} key="nav"/>,
			<div className="container mt-5" key="container">
				<h1 className="mt-5">{title}</h1>
				<p>{description}</p>
				
				<div className="container">
                    {this.renderQuestions()}
				</div>
				<div className="row mt-4">
					<div className="col text-center">
						<button className="btn btn-primary" onClick={this.addQuestion}>Add Question</button>
					</div>
				</div>
				<div className="row">
					<button className="btn btn-primary" onClick={this.handleSubmit}>Done</button>
				</div>
			</div>
		])
	}
}
export default EditQuiz;