import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/async-creatable'

const AsyncCreatableSelect = React.forwardRef((props, ref) => {

  useEffect(() => {
    if (props?.onChangeState) {
      props.onChangeState(props.value)
    }
  }, [props.value])

  return (
    <CreatableSelect
      cacheOptions
      defaultOptions
      {...props}
    />
  )
})

//************************************//
AsyncCreatableSelect.defaultProps = {
  isDisabled: false,
  isLoading: false,
  isClearable: false,
  isValidNewOption: () => {},
  isMulti: false,
  onCreateOption: () => {},
  loadOptions: () => {},
  value: '',
  onChange: () => {},
  onChangeState: () => {},
  className: ''
}
//************************************//
AsyncCreatableSelect.propTypes = {
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  isValidNewOption: PropTypes.func,
  isMulti: PropTypes.bool,
  onCreateOption: PropTypes.func.isRequired,
  loadOptions: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.string
      })
    ),
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string
    }),
    PropTypes.string
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeState: PropTypes.func,
  className: PropTypes.string
}

export default AsyncCreatableSelect
