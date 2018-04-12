import React, { Component } from 'react';
import NavBar from './NavBar.js';
import axios from 'axios';

class GameOver extends Component {

	constructor() {
		super();
		this.state = {
			players: [],
			completedAt: ""
		};
	}

	  componentDidMount() {


	    const token = localStorage.getItem('token');
		axios.get('/api/quizzes/' + window.location.pathname.split("/")[2], {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			this.setState({
				players: res.data.quiz.participants,
				completedAt: res.data.quiz.completedAt
			});

		});
	  }


	renderPlayerList() {
			return (

			this.state.players.sort((a, b) => a.points <= b.points).map((player, index) => {
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

	render() {
		return ([
			<NavBar history={this.props.history}/>,
			<div className="container">
			<h1> Quiz Over: Completed At -> {this.state.completedAt}</h1>
			<h2> Leader Board </h2>
				{this.renderPlayerList()}
			</div>
		])
	}
}

 export default GameOver;






