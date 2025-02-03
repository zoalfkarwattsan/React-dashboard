import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Input} from 'reactstrap'

const MultiBehaviourInput = React.forwardRef((props, ref) => {
  const {type, inputType, value, onChange = () => {}, onChangeText = () => {}, ...restProps} = props
  useEffect(() => {
    onChangeText(value)
  }, [value])
  return (
    <Input
      type={inputType}
      value={value}
      onChange={e => {
        onChange(e.target.value)
      }}
      {...restProps}
    />
  )
})

MultiBehaviourInput.propTypes = {

}

export default MultiBehaviourInput
