import React, { Component } from 'react';

class RoomCodeField extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className="input-group">
				<input type="text" className="input-group"/>
			</div>
		)
	}
}

export default RoomCodeField;