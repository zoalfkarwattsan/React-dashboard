import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye} from 'react-feather'
import {
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Badge
} from 'reactstrap'
import { Link } from 'react-router-dom'
//************************************//
import Breadcrumbs from '@src/components/breadcrumbs'
import DataTable, {ActionDropdownToggle} from '@src/components/datatable'
import {trans, env, _url} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import {_getDatatable} from "@csrc/utility/Utils"
//************************************//
import {_deleteResponsible} from '../../../redux/actions'
import CanCall from '../../../components/CanCall'
import ConfiguratorInfoModal from "./ConfiguratorInfoModal"
//************************************//
const tableColumns = (state, openDetailsModal, hasAction) => [
  {
    name: 'ID',
    selector: 'id',
    sortable: false,
    maxWidth: '25px',
    omit: true,
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.name'),
    selector: 'configurationName',
    sortable: false,
    grow: 1,
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.status.status'),
    sortable: false,
    grow: 1,
    filter: {
      enabled: false
    },
    cell: row => {
      return (
          row.status === 1 ? 'Ordered' : ''
      )
    }
  },
  {
    name: trans('gen.actions.actions'),
    allowOverflow: true,
    omit: !hasAction,
    center: true,
    grow: 0,
    cell: (row, index, column, id) => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <ActionDropdownToggle />
            <DropdownMenu right>
              <CanCall action='NoPermissionCode' id={`deleteUser_${row.id}`}>
                <DropdownItem className='w-100' onClick={e => openDetailsModal(row)}>
                  <Eye size={15}/>
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </DropdownItem>
              </CanCall>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
const tableActions = ['NoPermissionCode']
//************************************//
class UserConfigurators extends Component {
  static contextType = AbilityContext
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      detailsModal: {detailsModalShow: false, detailsModalData: null}
    }
  }
  //************************************//
  closeDetailsModal = () => {
    this.setState({detailsModal: {detailsModalShow: false, detailsModalData: {}}})
  }
  //************************************//
  openDetailsModal = (data) => {
    this.setState({detailsModal: {detailsModalShow: true, detailsModalData: data}})
  }
  //************************************//
  render () {
    const hasAction = _hasAnyAbility(this.context, tableActions)
    const {detailsModalShow, detailsModalData} = this.state.detailsModal
    return (
      <Fragment>
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.profile.userConfigurators')} breadCrumbParent='' breadCrumbActive='' >
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable
                ref={(ref) => { this.dataTableRef = ref }}
                _fetchData={(params, callback) => _getDatatable('ClientConfiguration/ReadWithDetails', {...params, filter: {...params.filter}}, callback)}
                columns={tableColumns(this.state, this.openDetailsModal, hasAction)}
                hasIndexing={false}
                hasFilter={false}
            />
          </Col>
        </Row>
        {
            detailsModalShow && (<ConfiguratorInfoModal data={detailsModalData} onClose={this.closeDetailsModal} />)
        }
      </Fragment>
    )
  }
}
//************************************//
const mapStateToProps = store => ({
  loading: store.app.loading,
  userId: _.get(store, `${env('REACT_APP_AUTH_MODULE')}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(UserConfigurators)
