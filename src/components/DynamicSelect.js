import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import _ from "lodash"

import InputContainer from "@src/components/helpers/InputContainer"

const DynamicSelect = props => {
  const {
    onChange = () => {},
    defaultValue = '',
    setValue = () => {},
    value = '',
    name = '',
    innerRef,
    rules = {},
    options = [],
    isMulti = false,
    className = '',
    unregister = () => {},
    placeholder = undefined
  } = props

  useEffect(() => {
    innerRef(name, {
      ...rules
    })
    if (isMulti && _.size(defaultValue) === 0) {
      setValue(name, '')
    } else {
      setValue(name, defaultValue)
    }
    return () => {
      unregister(name)
    }
  }, [])

  return (
    <InputContainer
      type={'uncontrolled-select'}
      options={options}
      isMulti={isMulti}
      value={value}
      className={className}
      placeholder={placeholder}
      onChange={e => {
        if (isMulti && _.size(e) === 0) {
          setValue(name, '')
        } else {
          setValue(name, e)
        }
        onChange(e)
      }}
    />
  )
}

DynamicSelect.propTypes = {

}

export default DynamicSelect
