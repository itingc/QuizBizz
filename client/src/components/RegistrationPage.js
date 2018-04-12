import React, { Component } from 'react';
import RegistrationBox from './RegistrationBox.js';
import Header from './Header.js';
import { Link } from 'react-router-dom';

class RegistrationPage extends Component {
	render() {
		return (
			<div className="height-screen">
				<Header/>
				<div className="height-screen">
					<div className="row height-screen">
						<div className="col-md-7 info-section pl-5">
							<div className="container d-flex flex-column">
								<div className="child d-flex">
									<img src={process.env.PUBLIC_URL + '/education-quiz.png'} alt="quiz icon"/>
									<h4 className="text-white">Create Quizzes</h4>
								</div>
								<div className="child d-flex">
									<img src={process.env.PUBLIC_URL + '/connection.png'} alt="quiz icon"/>
									<h4 className="text-white">Join real time quiz rooms</h4>
								</div>
								<div className="child d-flex">
									<img src={process.env.PUBLIC_URL + '/fireworks.png'} alt="quiz icon"/>
									<h4 className="text-white">Have fun</h4>
								</div>
								<Link to="/join" className="mb-4">
									<h2 className="join-room-button text-center">JOIN A ROOM HERE</h2>
								</Link>
							</div>
						</div>
						<div className="col-md-5 reg-section pt-5">
							<RegistrationBox history={this.props.history}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default RegistrationPage;