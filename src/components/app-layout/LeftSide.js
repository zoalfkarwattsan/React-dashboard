// ** React Imports
import React from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X } from 'react-feather'

const LeftSide = props => {
  // ** Props & Store
  const { leftSideShow, handleLeftSide, sidebarLeftShow, handleSidebarLeft } = props


  const headerHeight = props.headerHeight > 0 && props.leftHeader ? props.headerHeight : 0
  const footerHeight = props.footerHeight > 0 && props.leftFooter ? props.footerHeight : 0

  const closeSideBarLeft = () => {
    handleSidebarLeft()
  }

  return (
    <div className={classnames('sidebar-left')}>
      <div className='sidebar'>
        <div
          className={classnames('app-profile-sidebar', {
            show: sidebarLeftShow
          })}
        >
          {
            props.sidebarLeft
          }
        </div>
        <div
          className={classnames('sidebar-content', {
            show: leftSideShow === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleLeftSide}>
            <X size={14} />
          </div>

          <div className='left-side-header overflow-hidden' style={{height: headerHeight ?? 0}}>
            {
              props.leftHeader
            }
          </div>

          <PerfectScrollbar className='left-side-wrapper list-group' style={{height:`calc(100% - ${footerHeight}px - ${headerHeight}px)`}} options={{ wheelPropagation: false }}>
            {
              props.leftBody
            }
          </PerfectScrollbar>

          <div className={'side-left-footer'} style={{height: footerHeight}}>
            {
              props.leftFooter
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSide
