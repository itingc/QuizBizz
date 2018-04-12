import React, { Component } from "react";
import io from "socket.io-client";

class PlayerRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: '/',
      participants: [],
      roomId: "",
      mySocketId: ""
    };
  }

// need to do this when the user presses enter on the form 
//        r.setState({ participants: [data.playerName, ...this.state.participants] });


  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = io(endpoint);
    var r = this;

    this.socket.emit('createNewQuiz');
    this.socket.on('quizCreated', function(data){
        console.log(data.roomId + " " + data.mySocketId);
        r.setState({ 
          roomId: data.roomId,
          mySocketId: data.mySocketId
        });
      });
    this.socket.on('playerJoinedRoom', function(data){
      console.log(data.playerName);
      r.setState({ participants: [data.playerName, ...r.state.participants] });
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }


  render() {
    const people = this.state.participants.map(function(participant, index){
      return <li key={index}><b>{participant}</b> -> is here. </li>
    });
    return (
      <div style={{ textAlign: "center" }}>

        <div className="container mb-3">
        <div className="col-sm-4 offset-sm-4 border pb-3 pt-4 mb-3">
          <h3>Participants</h3>

            {people}
        </div>
      </div>
      </div>
    );
  }
}
export default PlayerRoom;

