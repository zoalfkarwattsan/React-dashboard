import React from 'react'
import PropTypes from 'prop-types'
import '../assets/scss/loading-dots.scss'

const LoadingIndicator = ({loading, children, containerModule = null}) => {
  if (loading) {
    return containerModule ? (
			<div className={containerModule.className} style={containerModule.css}>
				<div className="stage">
					<div className="dot-pulse"></div>
				</div>
			</div>
    ) : (
      <div className="stage">
        <div className="dot-pulse"></div>
      </div>
    )
  } else {
    return children
  }
}

LoadingIndicator.propTypes = {}

export default LoadingIndicator
