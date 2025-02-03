import React, {useEffect} from "react"
import {Controller} from 'react-hook-form'
import Proptypes from "prop-types"
//************************************//
import UncontrolledRRuleGenerator from "./UncontrolledRRuleGenerator"
//************************************//
const Component = React.forwardRef((props, ref)  => {
  const {value, controllerValue, header, error, validator, onChange, onInputChange} = props

  useEffect(() => {
    if (onChange) props.onChange(value)
  }, [controllerValue])

  return (
    <UncontrolledRRuleGenerator
      value={value}
      header={header}
      error={error}
      validator={validator}
      onChange={(value) => {
        if (onInputChange) onInputChange(value)
        if (onChange) onChange(value)
      }}
    />
  )
})

const RRuleGenerator = (props) => {
  const {name, control, rules, error, defaultValue, header, validator, onChange} = props
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      error={error}
      className={'controlled-rrule-generator'}
      defaultValue={defaultValue}
      controllerValue={defaultValue}
      as={Component}
      header={header}
      validator={validator}
      onInputChange={onChange}
    />
  )
}
//************************************//
RRuleGenerator.defaultProps = {
  name: '',
  control: null,
  rules: {},
  error: "",
  defaultValue: null,
  header: '',
  validator: {},
  onChange: (value) => {}
}
//************************************//
RRuleGenerator.propTypes = {
  name: Proptypes.string.isRequired,
  control: Proptypes.any,
  rules: Proptypes.object,
  error: Proptypes.string,
  defaultValue: Proptypes.shape({
    recurrence: Proptypes.string,
    duration: Proptypes.string
  }),
  header: Proptypes.string,
  validator: Proptypes.shape({
    startDate: Proptypes.any,
    endDate: Proptypes.any
  }),
  onChange: Proptypes.func
}
//************************************//
export default RRuleGenerator
