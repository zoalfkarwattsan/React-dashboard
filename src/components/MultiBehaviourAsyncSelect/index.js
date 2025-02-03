import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/async'

import {SelectStyleAction} from "@src/components/helpers/SelectConfigs"
import {trans} from '@utils'

const MultiBehaviourAsyncSelect = React.forwardRef((props, ref) => {
  const {value, onChangeState = () => {}, onChange = () => {}, onChangeText = () => {}, ...restProps} = props

  useEffect(() => {
    if (props?.onChangeState) {
      props.onChangeState(props.value)
    }
  }, [props.value])

  return (
    <AsyncSelect
      className='react-select'
      classNamePrefix='select'
      placeholder={trans('gen.reactSelect.placeholder')}
      styles={SelectStyleAction(props)}
      defaultOptions
      cacheOptions
      value={value}
      onChange={e => {
        onChange(e ?? '')
      }}
      {...restProps}
    />
  )
})

MultiBehaviourAsyncSelect.propTypes = {

}

export default MultiBehaviourAsyncSelect
