import React from "react"
import {Nav} from 'react-bootstrap'
import {User, Settings, ShoppingCart, HelpCircle} from 'react-feather'
import {trans} from '@utils'
import CanCall from "../../../components/CanCall"

const ResponsibleTabs = () => {
	return (
		<div className='profile-tabs d-flex justify-content-between flex-wrap mt-1 mt-md-0'>
			<Nav variant="pills" className="mb-0">

				<CanCall action='NoPermissionCode'>
					<Nav.Item>
						<Nav.Link eventKey="profileData">
							<span>
							  <User size={18} className='mr-25'/>
							</span>
							<span className='font-weight-bold'>{trans('user.profile.profileDetails')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='NoPermissionCode'>
					<Nav.Item>
						<Nav.Link eventKey="userConfigurators">
							<span>
							  <Settings size={18} className='mr-25'/>
							</span>
							<span className='font-weight-bold'>{trans('user.profile.userConfigurators')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='NoPermissionCode'>
					<Nav.Item>
						<Nav.Link eventKey="comingSoonTab1">
							<span>
							  <ShoppingCart size={18} className='mr-25'/>
							</span>
							<span className='font-weight-bold'>Orders</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='NoPermissionCode'>
					<Nav.Item>
						<Nav.Link eventKey="comingSoonTab2">
							<span>
							  <HelpCircle size={18} className='mr-25'/>
							</span>
							<span className='font-weight-bold'>Support requests</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

			</Nav>
		</div>
	)
}

export default ResponsibleTabs
