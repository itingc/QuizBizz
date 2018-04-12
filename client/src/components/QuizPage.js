import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar.js'
import axios from 'axios';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

class QuizPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			quiz: {}

		}
	}

	componentDidMount() {
		const token = localStorage.getItem('token');
		axios.get('/api/quizzes/' + window.location.pathname.split("/")[2], {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			this.setState({quiz: res.data.quiz});
		});
	}

	renderQuestions = () => {
		if (!this.state.quiz.questions) {
			return undefined;
		}
		return (this.state.quiz.questions.map((question, index) => {
			return (
				<div key={index} className="mb-2 col-md-12">
			      <Card>
			        <CardContent>
			          <Typography variant="headline" component="h2">
			            {`${index + 1}. ${question.question}`}
			          </Typography>
			          <Typography color="textSecondary">
			            {question.answer}
			          </Typography>
			        </CardContent>
			      </Card>
    			</div>
			)
		}));
	}

	render() {

		const {title, description} = this.state.quiz;
		return ([
			<NavBar history={this.props.history} key="navbar"/>,
			<div className="container" key="divcontainer">
				<h1 className="mt-5">{title}</h1>
				<p>{description}</p>
				<div className="row">
					<div className="col">
						<Link to={`/room/${this.state.quiz._id}`}>
							<button className="btn btn-primary">Play Now</button>
						</Link>
					</div>
				</div>
				<div className="row mt-4">
					{this.renderQuestions()}
				</div>
			</div>
		])
	}
}

export default QuizPage;