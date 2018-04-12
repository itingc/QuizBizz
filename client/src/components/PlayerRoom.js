import React, { Component } from "react";
import io from "socket.io-client";
import Header from './Header.js';
import Timer  from './Timer.js';

class PlayerRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: '/',
      roomId: window.location.pathname.split("/")[2],
      playerName: window.location.pathname.split("/")[3],
      pushButton: false,
      toTimer: false,
      currentQuestion: "test",
      gameOver: false,
      score: 0,
      leaderboardNum: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showButton = this.showButton.bind(this);

  }

// need to do this when the user presses enter on the form 
  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = io(endpoint);
    var data = {
    // needs to be elements from the forms, not random data
      roomId : this.state.roomId,
      playerName : this.state.playerName
    };

    var r = this;

    this.socket.emit('playerJoinGame', data, function(data){});


    this.socket.on('playerEnableBuzzer', function(){
      r.setState({
        pushButton: true
      });
    });

    this.socket.on('playerDisableBuzzer', function(){
      r.setState({
        pushButton: false
      });
    });

    this.socket.on('playerStartTimer', function(){
      r.setState({
        toTimer: true
      });
    });

    this.socket.on('playerStopTimer', function(){
      r.setState({
        toTimer: false
      });
    });
    this.socket.on('newQuestion', function(question){
      r.setState({
        currentQuestion: question
      });
     });

    this.socket.on('gameOver' + this.state.playerName, function(points){
      r.setState({
        gameOver: true,
        score: points
      });
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault();
    var data = {
        roomId: this.state.roomId,
        playerName: this.state.playerName
    };
    if(this.state.pushButton){
      this.socket.emit('playerPushButton',data);
    }
    this.setState({pushButton: false});
  }

  showButton(){
    setTimeout(function(){
      this.setState({toTimer: false});
    }.bind(this),62000); 
  }

  render() {
    const pushButton = this.state.pushButton;
    const toTimer = this.state.toTimer;
    if(toTimer){
      this.showButton();
      return ([
        <Timer/>
      ]);}
    if(this.state.gameOver){
      return([
          <Header/>,
          <div className="height-screen pt-5 bg-primarytwo">
            <div className="vertical-center text-center">
                  <h1> GAME OVER </h1>
                  <h1> SCORE : {this.state.score} </h1>
                                  
            </div>
          </div>
        ]);
    }

    return ([
      <Header/>,
      <div className="height-screen pt-5 bg-primarytwo">

        {/* <div className="container mb-3 mt-5">
        <div className="col-sm-4 offset-sm-4 buzzer-container pb-3 pt-4 mb-3">
          <div className="col-md-12 text-center">
          </div>
          </div>
          </div> */}
        <div className="vertical-center text-center">
              <h1 className="text-white"> {this.state.currentQuestion} </h1>
              <button type="submit" disabled={pushButton?false:true} className={pushButton ? "buzzer buzzer-green": "buzzer buzzer-red"}  onClick={this.handleSubmit}>BUZZ</button>
            
        </div>
      </div>
    ]);
  }
}
export default PlayerRoom;

