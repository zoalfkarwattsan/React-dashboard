import React, {useEffect, useRef} from 'react'
import {InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import {X} from 'react-feather'
import Proptypes from 'prop-types'
import classnames from "classnames"
import moment from 'moment'
//************************************//
import {trans} from '@utils' //toLocalDateFormat
//************************************//
import 'bootstrap-daterangepicker/daterangepicker.css'
//************************************//
const UncontrolledDateTime = React.forwardRef((props, currentRef) => {
  const ref = useRef(null)
  const Component = props.allowClear ? InputGroup : "div"
  const value = props.value
    // ? moment(props.value).toISOString(true)
    ? moment(props.value).toISOString(props.timezone)
    : undefined
  const startWithDisplayFormat = props.startWithDisplayFormat ? `${props.startWithDisplayFormat} ` : ''
  //************************************//
  const clearDate = () => {
    ref.current.$picker.val('')
    // onChange
    if (props.onChange) props.onChange(null)
    if (props.onInputChange) props.onInputChange(null)
    // onClear
    if (props.onClear) props.onClear({ ref: ref.current.$picker, value: null })
  }
  const handleApply = (event, picker) => {
    const date = picker.startDate
    if (date) {
      // const dateFormatted = moment(date).utc().toISOString()
      const dateFormatted = moment(date).utc(!props.timezone).toISOString()
      if (props.onChange) props.onChange(dateFormatted)
      if (props.onInputChange) props.onInputChange(dateFormatted)
    }
  }
  const handleOnEvent = (event, picker) => {
    // const container = picker.container
    // container.find('.calendar-time').css('color', 'transparent')
    // container.find('.minuteselect').css('display', 'none')
    // container.find('.calendar-time').off('change').on('change', 'select', () => {
    //   container.find('.minuteselect').css('display', 'none')
    // })
  }
  const getLocaleDateFormat = () => {
    return moment.localeData().longDateFormat(props.format)
  }
  // todo: Must move to Utils
  const toLocalDateFormat = (date, format = 'L', isUtc = true, timezone = false) => {
    date =  isUtc ? moment.utc(date) : moment(date)
    return timezone ? date.local().format(format) : date.format(format)
  }
  //************************************//
  useEffect(() => {
    if (props.refs) props.refs(ref)
  }, [ref])
  useEffect(() => {
    if (props.value !== undefined) {
      const displayFormat = props.displayFormat || props.format
      // if (props.value) ref.current.$picker.val(`${startWithDisplayFormat}${toLocalDateFormat(props.value, displayFormat)}`)
      if (props.value) ref.current.$picker.val(`${startWithDisplayFormat}${toLocalDateFormat(props.value, displayFormat, true, props.timezone)}`)
    }
  }, [props.value, props.minDate, props.maxDate, props.format, props.displayFormat, props.startWithDisplayFormat])
  //************************************//
  return (
    <Component>
      <DateRangePicker
        key={`${value} ${props.minDate} ${props.maxDate}`}
        ref={ref}
        initialSettings={{
          autoUpdateInput: false,
          singleDatePicker: true,
          timePicker: props.enableTime,
          showDropdowns: true,
          minYear: 1901,
          startDate: value ? value : undefined,
          minDate: props.minDate,
          maxDate: props.maxDate,
          locale: {
            format: getLocaleDateFormat(),
            cancelLabel: props.cancelLabel,
            applyLabel: props.applyLabel
          }
        }}
        onApply={handleApply}
        onEvent={handleOnEvent}
      >
        <input type="text"
               className={classnames(props.className, { 'form-control bg-white': true, [`form-control-${props.size}`]: props.size })}
               placeholder={props.placeholder}
               readOnly={true}
               style={{ opacity: 1 }}
        />
      </DateRangePicker>
      {props.allowClear && (
        <InputGroupAddon addonType='append'>
          <InputGroupText className="cursor-pointer" onClick={clearDate}>
            <X size={14}/>
          </InputGroupText>
        </InputGroupAddon>
      )}
    </Component>
  )
})
//************************************//
UncontrolledDateTime.defaultProps = {
  value: '',
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
  onChange: (date) => {},
  onClear: ({ref, value}) => {}
}
//************************************//
UncontrolledDateTime.propTypes = {
  value: Proptypes.any,
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
export default UncontrolledDateTime
