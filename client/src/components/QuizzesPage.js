import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';	
import NavBar from './NavBar.js';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class QuizzesPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			quizzes: [],
			showDeleteConfirmation: false,
			quizIdToBeDeleted: '',
			quizNameToBeDeleted: ''
		}
	}

	componentDidMount() {
		this.getQuizzes();
	}

	getQuizzes = () => {
		const token = localStorage.getItem('token');
		axios.get('/api/quizzes/', {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			this.setState({quizzes: res.data.quizzes});
		});
	}

	deleteQuiz = () => {
		const token = localStorage.getItem('token');
		this.handleClose();
		axios.delete('/api/quizzes/' + this.state.quizIdToBeDeleted, {
			headers: {
				"x-auth": token
			}
		}).then((res) => {
			console.log(res.data);
			this.getQuizzes();
		})
	}

	open = (e, id, title) => {
		e.preventDefault();
		this.setState({showDeleteConfirmation: true, quizIdToBeDeleted: id, quizNameToBeDeleted: title})
	}

	handleClose = () => {this.setState({showDeleteConfirmation: false})}

	renderQuizzes() {
		return this.state.quizzes.map((quiz) => {
			const url = "/quiz/" + quiz._id;
			const edit = "/edit/" + quiz._id;
			return (
				<div key={quiz._id} className="mb-2">
			      <Card key={quiz._id}>
			        <CardContent key={quiz._id}>
			          <Link to={url}>
				          <Typography variant="headline" component="h2">
				            {quiz.title}
				          </Typography>
				      </Link>
			          <Typography color="textSecondary">
			            {quiz.description}
			          </Typography>
			          	<Link to={`/room/${quiz._id}`}>
			          		<button className="btn btn-primary mt-3">Start</button>
			          	</Link>
			          	<a href="" className="mt-3 float-right ml-3" onClick={(e) => this.open(e, quiz._id, quiz.title)}>Delete</a>
						<Link to={edit} className="mt-3 float-right">
			          		Edit
			          	</Link>
			        </CardContent>
			      </Card>
    			</div>
			)
		});
	}

	render() {
		return [
			<NavBar history={this.props.history} key="navbar"/>,
			<div className="container mt-5" key="quiz-container">
				<h1>My Quizzes</h1>
				<div className="d-flex justify-content-end">
					<Link to="/create"><button className="btn btn-primary">Create new quiz</button></Link>
				</div>
				<div className="mt-3 mb-5">
					{this.renderQuizzes()}
				</div>
			</div>,
			<Dialog
			  key="popup"
          	  onClose={this.handleClose}
	          open={this.state.showDeleteConfirmation}
	        >
	        	<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
         		<DialogContent>
	            <DialogContentText id="alert-dialog-description">
	            	{this.state.quizNameToBeDeleted} will be permanently deleted.
	            </DialogContentText>
	          </DialogContent>
	          <DialogActions>
	            <Button onClick={this.handleClose} color="primary">
	              Cancel
	            </Button>
	            <Button onClick={this.deleteQuiz} color="primary" autoFocus>
	              Delete
	            </Button>
	          </DialogActions>
	        </Dialog>
		];
	}
}

export default QuizzesPage;