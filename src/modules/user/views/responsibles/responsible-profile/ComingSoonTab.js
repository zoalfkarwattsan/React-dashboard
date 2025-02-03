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
			<Row>
				<Col>
					<Card>
						<CardBody>
							<img width={'100%'} src={require('../../../assets/images/coming soon.png').default} alt={'123'}/>
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
