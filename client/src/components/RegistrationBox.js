import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import {GoogleLogin} from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

var validator = require('validator');

class RegistrationBox extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			validEmail: null,
			validPassword: null,
			loading: false
		}
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.register = this.register.bind(this);
		this.validPassword = this.validatePassword.bind(this);
		//this.responseFacebook = this.responseFacebook.bind(this);
		this.successGoogle = this.successGoogle.bind(this);
		this.errorGoogle = this.errorGoogle.bind(this);
	}

	handleEmail(e) {
		this.setState({email: e.target.value});
	}

	handlePassword(e) {
		this.setState({password: e.target.value});
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value
		})
	}

	register(e) {
		e.preventDefault();
		this.setState({loading: true});
		if (!this.state.validEmail || !this.state.validPassword) {
			this.setState({loading: false});
			return false;
		}
		axios.post('/users', {
			email: this.state.email,
			password: this.state.password
		}).then((res) => {
			this.setState({loading: false});
			//login user (give them token)
			localStorage.setItem('token', res.headers['x-auth']);
		}).then(() => {
			this.props.history.push("/quizzes");
		}).catch((e) => {
			this.setState({error: true});
			this.setState({loading: false});
		});
	}

	validatePassword = (e) => {
		if (e.target.value.length < 6) {
			console.log('password too short');
			this.setState({validPassword: false});
		} else {
			this.setState({validPassword: true});
		}
	}

	validateEmail = (e) => {
		this.setState({
			validEmail: validator.isEmail(e.target.value)
		});
	}

	// responseFacebook = (response) => {
	// 	console.log("facebook console");
	// 	console.log(response);
	// 	this.register();
	//   }

	successGoogle = (response) => {
		console.log("success");
		console.log(response);
		
		

		// this.setState({loading: true});
		
		// axios.post('/users', {
		// 	email: this.state.email,
		// 	password: this.state.password
		// }).then((res) => {
		// 	this.setState({loading: false});
		// 	//login user (give them token)
		// 	localStorage.setItem('token', res.headers['x-auth']);
		// }).then(() => {
		// 	this.props.history.push("/quizzes");
		// }).catch((response) => {
		// 	this.setState({error: true});
		// 	this.setState({loading: false});
		// });
	}

	errorGoogle = (response) => {
		console.log("error");
		console.log(response);
		
	}

	render() {
		const loading = () => {
			console.log('loading')
		  }

		return (
			<div className="d-flex pr-5 pl-5 flex-column">
				<div className="col-sm-12 pb-3 pt-4 mb-4 reg-container">
				{this.state.error ? <span className="error-text d-block text-center">The email has already been used.</span> : undefined}
					<h4 className="mt-4 mb-2">Join with your email</h4>
					<form action="" className="">
						<TextField
					      fullWidth
					      type="email"
					      label="Email"
					      margin="normal"
					      onChange={this.handleChange('email')}
					      onBlur={this.validateEmail}
					      error={this.state.validEmail || this.state.validEmail == null ? false : true}
					      helperText={this.state.validEmail || this.state.validEmail == null ? "" : "Enter a valid email"}
					    />
						<TextField
					      fullWidth
					      label="Password"
					      type="password"
					      margin="normal"
					      onChange={this.handleChange('password')}
					      onBlur={this.validatePassword}
					      error={this.state.validPassword || this.state.validPassword == null ? false : true}
					      helperText={this.state.validPassword || this.state.validPassword == null ? "" : "Password must be 6 characters in length"}
					    />
					    <div className="text-right">
					    	<button className="btn btn-primary mt-4 mb-3 d-flex align-items-center reg-button" onClick={this.register}>
					    		{ this.state.loading ?
					    			<CircularProgress size={24} className="loading"/> :
					    			"Register"
					    		}
					    	</button>
							<GoogleLogin
								clientId="579211846330-l8soqngrb75ud77bt7l70n37hk8vpj5c.apps.googleusercontent.com"
								scope="https://www.googleapis.com/auth/plus.login"
								buttonText="G Login"
								onSuccess={this.successGoogle}
								onFailure={this.errorGoogle}
								onRequest={loading}
								offline={false}
								responseType="code"
								isSignedIn = "true"
							/>

							{/* <FacebookLogin
								appId="260149824553966"
								autoLoad={true}
								fields="name,email,picture"
								callback={this.responseFacebook}
								cssClass="my-facebook-button-class"
								icon="fa-facebook"
							/> */}

							
							
					    </div>
					</form>
				</div>
				<div className="row">
					<div className="col-md-12 mt-4">
						<Link to="/login" className="text-center d-block">Already a user? Login here</Link>
					</div>
				</div>

			</div>
		)
	}
}

export default RegistrationBox;




