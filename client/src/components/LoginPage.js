import React, { Component } from 'react';
import LoginBox from './LoginBox.js';

class LoginPage extends Component {
	render() {
		return (
			<div className="d-flex justify-content-center login-container">
				<LoginBox history={this.props.history}/>
			</div>
		)
	}
}

export default LoginPage;