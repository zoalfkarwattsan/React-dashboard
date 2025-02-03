import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {GlobalDefinitionsContext} from "../../utility/context/GlobalDefinitions"
import {getFeatures} from "../../utility/Utils"

const Index = props => {
  const features = getFeatures()
  const {checkFeatureAvailability} = useContext(GlobalDefinitionsContext)

  const {featureKey} = props

  const feature = _.get(features, featureKey, null)

  if (checkFeatureAvailability(featureKey)) {
    return props.children
  }

  return React.cloneElement(feature.component, {...props})
}

Index.propTypes = {
  featureKey: PropTypes.string.isRequired
}

export default Index
