// ** React Imports
import React, { Fragment, useState, useEffect } from 'react'
import Proptypes from 'prop-types'

// ** Chat App Component Imports
import RightSide from './RightSide'
import LeftSide from './LeftSide'
import RightSideBar from './RightSideBar'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useDispatch } from 'react-redux'

import './scss/app-layout.scss'
import './scss/app-layout-right.scss'
import './scss/style.scss'

const CustomGridWrapper = (props) => {
  const {leftSideShow, setLeftSideShow, sidebarLeft, setSidebarLeft, sidebarRight, setSidebarRight, hideLeftLg, setHideLeftLg} = props.states

  // ** Sidebar & overlay toggle functions
  const handleLeftSide = () => setLeftSideShow(!leftSideShow)
  const handleSidebarLeft = () => setSidebarLeft(!sidebarLeft)
  const handleSidebarRight = () => setSidebarRight(!sidebarRight)
  const handleOverlayClick = () => {
    setLeftSideShow(false)
    setSidebarRight(false)
    setSidebarLeft(false)
  }

  return (
      <div className={classnames('d-flex app-layout-wrapper', {
        "hide-left-side": hideLeftLg
      })}>
        <LeftSide
            leftSideShow={leftSideShow}
            handleLeftSide={handleLeftSide}
            sidebarLeftShow={sidebarLeft}
            handleSidebarLeft={handleSidebarLeft}
            {...props}
        />
        <div className='content-right'>
          <div className='content-wrapper pb-0'>
            <div className='content-body'>
              <div
                  className={classnames('body-content-overlay', {
                    show: sidebarRight === true || leftSideShow === true || sidebarLeft === true
                  })}
                  onClick={handleOverlayClick}
              ></div>
              <RightSide
                  {...props}
              />
              <RightSideBar
                  sidebarRight={sidebarRight}
                  handleSidebarRight={handleSidebarRight}
              />
            </div>
          </div>
        </div>
      </div>
  )
}

CustomGridWrapper.propTypes = {
  headerHeight: Proptypes.number,
  footerHeight:Proptypes.number,
  leftHeader:Proptypes.object,
  leftBody:Proptypes.object,
  leftFooter:Proptypes.object,
  leftSideBar:Proptypes.object,

  rightHeader:Proptypes.object,
  rightBody:Proptypes.object,
  rightFooter:Proptypes.object
}

export default CustomGridWrapper
