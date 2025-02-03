import React from "react"
import {Shield} from "react-feather"

import {navTrans} from '@utils'

export const Navigation = [
	{
	  id: 'Roles&Permissions',
	  title: 'rolespermissions.nav.rolesPermissions',
	  icon: <Shield />,
	  navLink: '/roles/list',
	  action: 'call',
	  resource: 'ROLES_VIEW_LIST'
	}
]
