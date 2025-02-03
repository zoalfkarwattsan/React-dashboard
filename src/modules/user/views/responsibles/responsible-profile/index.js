import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Button } from 'reactstrap'
import {Tab} from 'react-bootstrap'
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import _ from 'lodash'

import Breadcrumbs from '@src/components/breadcrumbs'
import {trans} from '@utils'
import '@styles/react/pages/page-profile.scss'

import {_getResponsible} from "../../../redux/actions"
import ProfileDataTab from "./ProfileDataTab"
import ProfileHeader from './ProfileHeader'
import UserConfigurators from "./UserConfigurators"
import ComingSoonTab from "./ComingSoonTab"

const ResponsibleProfile = () => {
	const loading = useSelector(state => state.app.loading)
	const [data, setData] = useState({})
	const {id} = useParams()

	useEffect(() => {
		_getResponsible(
			id,
			(data) => {
				if (_.size(data) === 1) {
					setData(data[0])
				}
			}
		)
	}, [])

	return (
		<Tab.Container unmountOnExit={true} mountOnEnter={true} defaultActiveKey="profileData">
			<div id='user-profile'>
				<Row>
					<Col sm='12'>
						<ProfileHeader data={data} />
					</Col>
				</Row>
			</div>
			{!_.isEmpty(data) && (
				<>
					<Tab.Content>
						<Tab.Pane eventKey="profileData">
							<ProfileDataTab data={data} />
						</Tab.Pane>
					</Tab.Content>
					<Tab.Content>
						<Tab.Pane eventKey="userConfigurators">
							<UserConfigurators />
						</Tab.Pane>
					</Tab.Content>
					<Tab.Content>
						<Tab.Pane eventKey="comingSoonTab1">
							<ComingSoonTab />
						</Tab.Pane>
					</Tab.Content>
					<Tab.Content>
						<Tab.Pane eventKey="comingSoonTab2">
							<ComingSoonTab />
						</Tab.Pane>
					</Tab.Content>
				</>
			)}
		</Tab.Container>
	)
}

export default ResponsibleProfile
