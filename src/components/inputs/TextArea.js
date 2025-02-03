import React, { Component } from "react"
import { Input } from "reactstrap"
import autosize from "autosize"

export default class TextArea extends Component {
	constructor(props) {
		super(props)
		this.state = {
			val:"",
			init: true
		}
		this.handleKeyDown = this.handleKeyDown.bind(this)
	}

	componentDidMount() {
		this.textarea.focus()
		this.textarea.selectionStart = this.textarea.value.length
		setTimeout(() => {
			autosize(this.textarea)
		}, 50)
		// this.textarea.hidden = true
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	handleKeyDown (e) {
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault()
			this.props.onBlur(e)
		}
	}

	render() {
		const style = {
			// minHeight: "38px",
			resize: "none",
			// padding: "9px",
			// boxSizing: "border-box",
			// fontSize: "15px",
			width:'100%',
			borderRadius:5,
			// margin:0,
			backgroundColor:'transparent',
			border:'none'
		}
		const {init, ignoreFirstBlur, setInit, ...rest} = this.props
		return (
			<textarea
				{...rest}
				style={{...style, ...this.props.style}}
				className={`_1EEDX ${this.props.className}`}
				ref={c => (this.textarea = c)}
				placeholder={this.props.placeholder}
				rows={1}
				autoFocus={true}
				name={this.props.name}
				defaultValue={this.props.defaultValue}
				value={this.props.value ?? undefined}
				onChange={this.props.onChange ?? undefined}
				onBlur={(e) => {
					if (this.state.init && this.props.init && this.props.ignoreFirstBlur) {
						this.setState({init: false}, () => {
							this.props.setInit(false)
							this.textarea.focus()
						})
					} else {
						this.props.onBlur(e)
					}
				}}
				onKeyDown={this.handleKeyDown}
				// onClickCapture={() => {
				// 	console.log('onClickCapture')
				// 	// if(!editable){
				// 		this.textarea.focus()
				// 		this.textarea.selectionStart = this.textarea.value.length
				// 		this.textarea.selectionEnd = this.textarea.value.length
				// 	// }
				// }}
			/>
		)
	}
}
