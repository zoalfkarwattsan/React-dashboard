import React, {Fragment, useEffect, useRef, useState} from 'react'
import _ from "lodash"
import autosize from "autosize/dist/autosize"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPen, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

import TextArea from "./TextArea"
import '../../assets/scss/content-editable.scss'

const UncontrolledContentEditable = (props) => {
	const {_onEdit = () => {}, _onChange = () => {}, _onFocus = () => {}, defaultValue, placeholder, className, style, hasIcon, popUpInfo, icon, disabled, enableEditFromInit, html = false, editText = false, ignoreFirstBlur = false} = props
	const [value, setValue] = useState(defaultValue)
	const [rows, setRows] = useState(_.size(_.split(defaultValue, '\n')))
	const [editable, setEditable] = useState(enableEditFromInit || (editText))
	const [init, setInit] = useState(true)
	const editableRef = useRef()
	const newRef = useRef()

	useEffect(() => {
		setValue(defaultValue)
		setRows(_.size(_.split(defaultValue, '\n')))
	}, [defaultValue])

	useEffect(() => {
		autosize(newRef)
	}, [])

	const _onStateEdit = (e) => {
		// console.log(e.key)
		setValue(e.target.value)
		setRows(_.size(_.split(e.target.value, '\n')))
		_onChange(e.target.value)
	}

	const _onSave = (e) => {
		if (!editText) {
			setEditable(false)
		}
		if (e.target.value !== defaultValue && !(e.target.value === '' && defaultValue === null)) {
			_onEdit(e.target)
		}
	}
	const styles = {
		position: 'relative',
		fontSize:'1rem',
		lineHeight: '2rem',
		width:'100%',
		maxWidth:'100%',
		background:'transparent',
		margin: 0,
		border:'2px transparent solid',
		...style
	}
	const renderSpanItem = (x, i, last) => {
		return x.length > 0 ? <span>{x}</span> : <span>&nbsp;</span>
	}

	return (
		<>
			{
				html ? (
					<div>
						<div className={`_1EEDX _ygkSb ${className}`} dangerouslySetInnerHTML={{__html: value}} >
						</div>
						{popUpInfo && <div onClick={popUpInfo} className={'d-flex justify-content-center align-items-center'} style={{position:'absolute', top:0, right:5, height:'100%', zIndex:9999999}}><FontAwesomeIcon style={{fontSize: 12}} icon={icon ?? faQuestionCircle} color={'#aaa'} /></div>}
					</div>
				) : (
					editable ? (
						<>
							<TextArea
								className={`text-area ${className}`}
								// placeholder={placeholder}
								style={styles}
								value={value}
								onChange={(e) => _onStateEdit(e)}
								onBlur={_onSave}
								onFocus={_onFocus}
								ignoreFirstBlur={ignoreFirstBlur}
								init={init}
								setInit={setInit}
							/>
							{popUpInfo && <div onClick={popUpInfo} className={'d-flex justify-content-center align-items-center'} style={{position:'absolute', top:0, right:5, height:'100%', zIndex:9999999}}><FontAwesomeIcon style={{fontSize: 12}} icon={icon ?? faQuestionCircle} color={'#aaa'} /></div>}
						</>
					) : (
						<div
							className={`_1EEDX _ygkSb ${className}`}
							style={styles}
							onClick={() => {
								if (!disabled && !editText) {
									setEditable(true)
								}
							}}
							id={props.id ?? undefined}
						>
							{
								value && value.length > 0 && value.indexOf('\n') > -1 ? value.split('\n').map((x, i) => {
									return (
										i > 0 ? <Fragment key={i}>
											<br />
											{renderSpanItem(x, i)}
										</Fragment> : <Fragment key={i}>
											{renderSpanItem(x, i)}
										</Fragment>
									)
								}) : (value && value.length > 0 ? <span>{value}</span> : <span className={'placeholder'}>{placeholder}</span>)
							}
							{hasIcon && <>&nbsp;&nbsp;<FontAwesomeIcon style={{fontSize: 12}} icon={faPen} color={'#aaa'} /></>}
							{popUpInfo && <div onClick={popUpInfo} className={'d-flex justify-content-center align-items-center'} style={{position:'absolute', top:0, right:5, height:'100%'}}><FontAwesomeIcon style={{fontSize: 12}} icon={icon ?? faQuestionCircle} color={'#aaa'} /></div>}
						</div>
					)
				)
			}
		</>
	)
}

UncontrolledContentEditable.propTypes = {

}

export default UncontrolledContentEditable
