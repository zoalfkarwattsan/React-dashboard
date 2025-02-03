// ** React Imports
import React from 'react'
// ** Third Party Components
import classnames from 'classnames'

const RightSide = props => {

  const headerHeight = props.headerHeight > 0 && props.rightHeader ? props.headerHeight : 0
  const footerHeight = props.footerHeight > 0 && props.rightFooter ? props.footerHeight : 0

  return (
    <div className='right-side-wrapper'>
      <div className={classnames('active-right-body')}>

        <div className='right-left-navbar'>
          <header className='right-side-header overflow-hidden' style={{height: headerHeight ?? 0}}>
            {
              props.rightHeader
            }
          </header>
        </div>

        <div style={{height: `calc(100% - ${headerHeight ?? 0}px - ${footerHeight ?? 0}px)`}}>
          {
            props.rightBody
          }
        </div>

        <div className='right-side-footer overflow-hidden' style={{height: footerHeight ?? 0}}>
          {
            props.rightFooter
          }
        </div>
      </div>
    </div>
  )
}

export default RightSide
