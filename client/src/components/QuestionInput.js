import React, { Component } from 'react';

class QuestionInput extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
		}
	}

	handleChange(e) {
		const questionAnswer = {
			question: this.refs.questionText.value,
			answer: this.refs.answerText.value,
			key: this.props.id
		}
		this.props.updateQuestion(this.props.id, questionAnswer);
		console.log('key is ' + this.props.id);
	}

	handleRemove = () => {
		console.log('removing' + this.props.id);
		this.props.removeQuestion(this.props.id);
	}

	componentWillReceiveProps() {
		this.setState({question: this.props.question});
	}
	componentDidMount() {
		this.refs.questionText.value = this.props.question.question;
		this.refs.answerText.value = this.props.question.answer;
	}

	render() {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<span className="big-number mr-3">{this.props.number}.</span>
				<div className="form-group qa-inputs">
					<input className="question form-control" type="text" ref="questionText" onChange={this.handleChange} placeholder="Question"/>
					<input className="answer form-control" type="text" ref="answerText" onChange={this.handleChange} placeholder="Answer"/>
				</div>
				<span className="ml-3" onClick={this.handleRemove}>X</span>
			</div>
		)
	}

}

export default QuestionInput;