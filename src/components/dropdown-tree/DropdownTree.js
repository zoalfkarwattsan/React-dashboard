import React, {useState, useEffect} from 'react'
import {Controller} from 'react-hook-form'
import classNames from 'classnames'
import Proptypes from "prop-types"
//************************************//
import {trans} from '@utils'
//************************************//
import UncontrolledDropdownTree from "./UncontrolledDropdownTree"
//************************************//
const Component = React.forwardRef(({ name, value, className, onChange, onInputChange, loadOptions, multi, group, clearable, groupOptionFormat, optionFormatter, dropdownOptions }, ref)  => {

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <UncontrolledDropdownTree
      name={name}
      value={value}
      onChange={({ value, options }) => {
        onInputChange({ value, options })
        onChange(group ? value : options) // just for now
      }}
      className={className}
      loadOptions={loadOptions}
      optionFormatter={optionFormatter}
      dropdownOptions={dropdownOptions}
      multi={multi}
      group={group}
      clearable={clearable}
      groupOptionFormat={groupOptionFormat}
    />
  )
})
const DropdownTree = ({ name, control, className, defaultValue, onChange, loadOptions, multi, group, clearable, groupOptionFormat, optionFormatter, dropdownOptions, rules, ...restProps }) => {
  const {required, validate, ...restRules} = rules
  const rulesValidation = {}
  if (required) {
    rulesValidation.validate = {
      valid: (value) => {
        return value?.length > 0 || trans('gen.validations.required')
      },
      ...validate
    }
  }
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      className={classNames(className, { "is-invalid": required })}
      as={Component}
      onInputChange={onChange}
      loadOptions={loadOptions}
      optionFormatter={optionFormatter}
      dropdownOptions={dropdownOptions}
      multi={multi}
      group={group}
      clearable={clearable}
      groupOptionFormat={groupOptionFormat}
      rules={{
        ...rulesValidation,
        ...restRules
      }}
      {...restProps}
    />
  )
}
//************************************//
DropdownTree.defaultProps = {
  name: '',
  control: null,
  defaultValue: [],
  className: '',
  loadOptions: (q = '', parentId = '', ids = []) => {},
  delaySearch: 500,
  optionFormatter: (option) => {
    return {
      groupCode: option.groupCode,
      groupLabel: option.groupLabel,
      value: option.value,
      label: option.label,
      hasChildren: option.children?.length > 0,
      ancestors: option.ancestors,
      fixed: option.fixed,
      canSelect: true
    }
  },
  onChange: ({ value, options }) => {},
  dropdownOptions: {
    dropdownDirection: 'down',
    dropdownClassName: '',
    dropdownMenuFlip: true,
    dropdownMenuHeight: '250px',
    showDropdownLeafIcon: true,
    dropdownLeafCustomIcon: null
  },
  rules: {
    required: false,
    validate: {}
  },
  multi: true,
  group: false,
  clearable: false,
  groupOptionFormat: null
}
//************************************//
DropdownTree.propTypes = {
  name: Proptypes.string.isRequired,
  control: Proptypes.any,
  defaultValue: Proptypes.oneOfType([
    Proptypes.arrayOf(Proptypes.any),
    Proptypes.arrayOf(
      Proptypes.shape({
        value: Proptypes.any
      })
    )
  ]),
  className: Proptypes.string,
  onChange: Proptypes.func,
  loadOptions: Proptypes.func,
  delaySearch: Proptypes.number,
  optionFormatter: Proptypes.func,
  dropdownOptions: Proptypes.shape({
    dropdownDirection: Proptypes.oneOf(['up', 'down']),
    dropdownClassName: Proptypes.string,
    dropdownMenuFlip: Proptypes.bool,
    dropdownMenuHeight: Proptypes.string,
    showDropdownLeafIcon: Proptypes.bool,
    dropdownLeafCustomIcon: Proptypes.any
  }),
  rules: Proptypes.shape({
    required: Proptypes.bool,
    validate: Proptypes.object
  }),
  multi: Proptypes.bool,
  group: Proptypes.bool,
  clearable: Proptypes.bool,
  groupOptionFormat: Proptypes.objectOf(
    Proptypes.shape({
      optionsMap: Proptypes.shape({
        value: Proptypes.string,
        label: Proptypes.string,
        fixed: Proptypes.string
      }),
      groupCode: Proptypes.string
    })
  )
}
//************************************//
export default DropdownTree
