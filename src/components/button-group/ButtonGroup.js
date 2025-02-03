import React from 'react'
import {Controller} from "react-hook-form"
import Proptypes from 'prop-types'
//************************************//
import UncontrolledButtonGroup from './UncontrolledButtonGroup'
//************************************//
const ButtonGroup = (props) => {
  const firstOptionValue = _.get(_.head(props.options), 'value')
  const find = _.find(props.options, option => option.value === props.defaultValue)
  const defaultValue = find ? props.defaultValue : firstOptionValue
  return (
    <Controller
      as={<UncontrolledButtonGroup/>}
      name={props.name}
      control={props.control}
      defaultValue={defaultValue}
      changedValue={defaultValue}
      options={props.options}
      color={props.color}
      size={props.size}
      isMulti={props.isMulti}
      onInputChange={props.onChange}
    />
  )
}
//************************************//
ButtonGroup.defaultProps = {
  name: '',
  defaultValue: '',
  control: null,
  options: [],
  color: 'primary',
  size: 'sm',
  isMulti: false,
  isCircle: false,
  isSplit: false,
  onChange: (value) => {}
}
//************************************//
ButtonGroup.propTypes = {
  name: Proptypes.string.isRequired,
  defaultValue: Proptypes.string,
  control: Proptypes.any,
  options: Proptypes.arrayOf(Proptypes.shape({
    label: Proptypes.string,
    value: Proptypes.string
  })),
  color: Proptypes.string,
  size: Proptypes.string,
  isMulti: Proptypes.bool,
  isCircle: Proptypes.bool,
  isSplit: Proptypes.bool,
  onChange: Proptypes.func
}
//************************************//
export default ButtonGroup
