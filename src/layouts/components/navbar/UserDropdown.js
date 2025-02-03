// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {FormattedMessage} from "react-intl"

// ** Custom Components
import Avatar from '@components/avatar'
import {CanCall, _logout} from "@authModule"

// ** Utils
import { isUserLoggedIn, formatUserName } from '@utils'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { Settings, Power, User } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(state => state.user.userData)

  //** Vars
  const userAvatar = (user && user.avatar) || defaultAvatar

  const _logoutClick = () => {
    dispatch(_logout())
    history.push('/')
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{user?.first_name}</span>
          {/*<span className='user-status'>{(user && user.role) || ''}</span>*/}
        </div>
        <Avatar
          content={formatUserName(user)}
          // img={userAvatar}
          imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        {/*<DropdownItem tag={Link} to='/user/account-settings'>*/}
        {/*  <User size={14} className='mr-75' />*/}
        {/*  <span className='align-middle'>*/}
        {/*      <FormattedMessage*/}
        {/*      id={`user.accountSettings.accountSettings`} />*/}
        {/*  </span>*/}
        {/*</DropdownItem>*/}
        {/*<CanCall action='USR_VIEW_SETTINGS'>*/}
        {/*  <DropdownItem tag={Link} to='/settings'>*/}
        {/*    <Settings size={14} className='mr-75' />*/}
        {/*    <span className='align-middle'>*/}
        {/*      <FormattedMessage*/}
        {/*        id={`gen.actions.settings`} />*/}
        {/*    </span>*/}
        {/*  </DropdownItem>*/}
        {/*</CanCall>*/}
        {
        <DropdownItem className={'w-100'} onClick={_logoutClick}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>
              <FormattedMessage
                  id={`gen.actions.logout`} /></span>
        </DropdownItem>
        }
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
