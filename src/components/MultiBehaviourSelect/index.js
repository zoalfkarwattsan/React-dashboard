import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import {SelectStyleAction} from "@src/components/helpers/SelectConfigs"
import {trans} from '@utils'

const MultiBehaviourSelect = React.forwardRef((props, ref) => {
  const {value, onChoose = () => {}, onChange = () => {}, onChangeText = () => {}, ...restProps} = props
  useEffect(() => {
    onChoose(value)
  }, [value])
  return (
    <Select
      className='react-select'
      classNamePrefix='select'
      placeholder={trans('gen.reactSelect.placeholder')}
      styles={SelectStyleAction(props)}
      value={value}
      onChange={e => {
        onChange(e)
      }}
      {...restProps}
    />
  )
})

MultiBehaviourSelect.propTypes = {

}

export default MultiBehaviourSelect
