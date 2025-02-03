import React, {Fragment, useContext} from 'react'
import PropTypes from 'prop-types'
import {Card, CardBody, CardHeader, CardText, CardTitle, Col, Row, Label, FormGroup} from "reactstrap"
import {Briefcase, CheckSquare} from "react-feather"
import Chart from "react-apexcharts"

import StatsVertical from '@components/widgets/stats/StatsVertical'
import {trans} from '@utils'
import Breadcrumbs from '@src/components/breadcrumbs'

const ProfileDataTab = ({data}) => {

	return (
		<Fragment>
			<Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.profile.profileDetails')} breadCrumbParent='' breadCrumbActive='' >
			</Breadcrumbs>
			{/*<Row>*/}
			{/*	/!*<Col sm='3' xs='6'>*!/*/}
			{/*	/!*	<StatsVertical icon={<Briefcase size={21} />} color='secondary' stats={`${data.projects.length}`} statTitle={useTrans('user.profile.projects')} />*!/*/}
			{/*	/!*</Col>*!/*/}
			{/*	<Col sm='3' xs='6'>*/}
			{/*		<StatsVertical icon={<CheckSquare size={21} />} color='secondary' stats={`1`} statTitle={'أرقام الهواتف'} />*/}
			{/*	</Col>*/}
			{/*	<Col sm='3' xs='6'>*/}
			{/*		<StatsVertical icon={<CheckSquare size={21} />} color='success' stats={`1`} statTitle={'حجوزات مقبولة'} />*/}
			{/*	</Col>*/}
			{/*	<Col sm='3' xs='6'>*/}
			{/*		<StatsVertical icon={<CheckSquare size={21} />} color='warning' stats={`0`} statTitle={'حجوزات قيد المعالجة'} />*/}
			{/*	</Col>*/}
			{/*	<Col sm='3' xs='6'>*/}
			{/*		<StatsVertical icon={<CheckSquare size={21} />} color='danger' stats={`0`} statTitle={'حجوزات مرفوضة'} />*/}
			{/*	</Col>*/}
			{/*</Row>*/}
			<Row>
				<Col>
					<Card>
						<CardBody>
							<Row>
								<Col xs={6}>
									<span>{trans('user.fname')}</span>
									<p className={'px-25'}>{data.firstName ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.lname')}</span>
									<p className={'px-25'}>{data.lastName ?? '-'}</p>
								</Col>
								<Col xs={6}>
									<span>{trans('user.email')}</span>
									<p className={'px-25'}>{data.email ?? '-'}</p>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

ProfileDataTab.propTypes = {

}

export default ProfileDataTab
