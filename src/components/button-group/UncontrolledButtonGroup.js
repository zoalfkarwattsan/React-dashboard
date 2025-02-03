import React, {useEffect, useState} from 'react'
import {ButtonGroup as BSButtonGroup, Button} from 'reactstrap'
import Proptypes from "prop-types"
import classNames from 'classnames'
//************************************//
const UncontrolledButtonGroup = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(null)
  //************************************//
  const onButtonGroupClick = (optionValue) => {
    let resultValue
    if (props.isMulti) {
      const findValue = _.find(value, value => value === optionValue)
      if (findValue === undefined) {
        resultValue = [...value, optionValue]
      } else {
        resultValue = _.filter(value, value => value !== optionValue)
      }
      // state
      setValue(resultValue)
    } else {
      resultValue = optionValue
      // state
      setValue(resultValue)
    }

    // change
    if (props.onChange) props.onChange(resultValue)
    if (props.onInputChange) props.onInputChange(resultValue)
  }
  //************************************//
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  useEffect(() => {
    if (props.onChange) props.onChange(props.changedValue)
  }, [props.changedValue])
  //************************************//
  const activeValueRender = (option) => {
    if (props.isMulti) {
      const find = _.find(value, value => value === option.value)
      return find !== undefined
    } else {
      return option.value === value
    }
  }
  const outlineRender = (option) => {
    if (props.isMulti) {
      const find = _.find(value, value => value === option.value)
      return find === undefined
    } else {
      return option.value !== value
    }
  }
  //************************************//
  const Component = props.isSplit || props.isCircle ? "div" : BSButtonGroup
  return (
    <Component className={"button-group-wrapper"}>
      {_.map(props.options, option => (
        <Button
          key={option.value}
          className={classNames({ "mr-50 mb-75": props.isSplit || props.isCircle, "rounded-circle": props.isCircle })}
          color={props.color}
          onClick={() => onButtonGroupClick(option.value)}
          active={activeValueRender(option)}
          size={props.size}
          disabled={option.disable || false}
          outline={outlineRender(option)}
        >
          {option.label}
        </Button>
      ))}
    </Component>
  )
})
//************************************//
UncontrolledButtonGroup.defaultProps = {
  value: '',
  options: [],
  color: 'primary',
  size: 'sm',
  isMulti: false,
  isCircle: false,
  isSplit: false,
  onChange: (value) => {}
}
//************************************//
UncontrolledButtonGroup.propTypes = {
  value: Proptypes.any,
  options: Proptypes.arrayOf(Proptypes.shape({
    label: Proptypes.string,
    value: Proptypes.any
  })),
  color: Proptypes.string,
  size: Proptypes.string,
  isMulti: Proptypes.bool,
  isCircle: Proptypes.bool,
  isSplit: Proptypes.bool,
  onChange: Proptypes.func
}
export default UncontrolledButtonGroup
