import React, {Fragment, useState} from 'react'
import {Controller} from "react-hook-form"
import Proptypes from 'prop-types'
import moment from "moment"
//************************************//
import {trans} from '@utils'
//************************************//
import UncontrolledDateTime from "./UncontrolledDateTime"
//************************************//
const DateTime = (props) => {
  const [ref, setRef] = useState(null)
  const defaultValue = props.defaultValue
    // ? moment(props.defaultValue).toISOString(true)
    ? moment(props.defaultValue).toISOString(props.timezone)
    : null
  //************************************//
  return (
    <Controller
      refs={(ref) => setRef(ref)}
      as={UncontrolledDateTime}
      name={props.name}
      control={props.control}
      defaultValue={defaultValue}
      className={props.className}
      placeholder={props.placeholder}
      size={props.size}
      format={props.format}
      startWithDisplayFormat={props.startWithDisplayFormat}
      displayFormat={props.displayFormat}
      minDate={props.minDate}
      maxDate={props.maxDate}
      enableTime={props.enableTime}
      allowClear={props.allowClear}
      timezone={props.timezone}
      cancelLabel={props.cancelLabel}
      applyLabel={props.applyLabel}
      onFocus={() => {
        // console.log(ref)
        // focus on validation
        // focus and close on validation
      }}
      onInputChange={(value) => {
        props.onChange(value)
      }}
      onClear={(clearProps) => {
        props.onClear(clearProps)
      }}
    />
  )
}
//************************************//
DateTime.defaultProps = {
  name: '',
  control: null,
  defaultValue: '',
  className: '',
  placeholder: '',
  size: 'md',
  format: 'L',
  displayFormat: 'L',
  startWithDisplayFormat: '',
  minDate: null,
  maxDate: null,
  enableTime: false,
  allowClear: false,
  timezone: true,
  cancelLabel: trans('gen.actions.cancel'),
  applyLabel: trans('gen.actions.apply'),
  onChange: (value) => {},
  onClear: ({ref, value}) => {}
}
//************************************//
DateTime.propTypes = {
  name: Proptypes.string.isRequired,
  control: Proptypes.any,
  defaultValue: Proptypes.any,
  className: Proptypes.string,
  placeholder: Proptypes.string,
  size: Proptypes.string,
  format: Proptypes.string,
  displayFormat: Proptypes.string,
  startWithDisplayFormat: Proptypes.string,
  minDate: Proptypes.string,
  maxDate: Proptypes.string,
  enableTime: Proptypes.bool,
  allowClear: Proptypes.bool,
  timezone: Proptypes.bool,
  cancelLabel: Proptypes.string,
  applyLabel: Proptypes.string,
  onChange: Proptypes.func,
  onClear: Proptypes.func
}
//************************************//
export default DateTime
