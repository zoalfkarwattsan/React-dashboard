import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable'

const CreatableSelect = React.forwardRef((props, ref) => {

  useEffect(() => {
    onChangeState(props.value)
  }, [props.value])

  return (
    <CreatableSelect
      {...props}
    />
  )
})


//************************************//
CreatableSelect.defaultProps = {
  isDisabled: false,
  isLoading: false,
  isClearable: false,
  isValidNewOption: () => {},
  isMulti: false,
  onCreateOption: () => {},
  options: [],
  value: '',
  onChange: () => {},
  onChangeState: () => {},
  className: ''
}
//************************************//
CreatableSelect.propTypes = {
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  isValidNewOption: PropTypes.func,
  isMulti: PropTypes.bool,
  onCreateOption: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string
    })
  ).isRequired,
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
    })
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeState: PropTypes.func,
  className: PropTypes.string
}

export default CreatableSelect;