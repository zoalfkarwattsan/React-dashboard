import React from "react"
import {Bell, List, Shield, Home, Lock, Star, User, Users, UserCheck} from "react-feather"

import {trans} from '@utils'

export const Navigation = [
  {
    id: 'dashboard',
    title: 'user.nav.dashboard',
    icon: <Home size={20}/>,
    navLink: '/dashboard',
    action: 'call',
    resource: 'general'
  },
  {
    id: 'adminList',
    title: 'user.nav.adminList',
    icon: <Lock />,
    navLink: '/admin/list',
    action: 'call',
    resource: 'NoPermissionCode'
  },
  {
    id: 'teams',
    title: 'user.nav.users',
    icon: <User />,
    navLink: '/users/list',
    action: 'call',
    resource: 'NoPermissionCode'
  }
]
