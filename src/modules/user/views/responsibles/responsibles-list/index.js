import React, { Fragment, Component, memo } from 'react'
import { connect } from 'react-redux'
import {FileText, MoreVertical, Send, Plus, Key, User, Trash, Eye, StopCircle, UserCheck, UserX} from 'react-feather'
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
import {trans, _confirm, _url, env} from '@utils'
import {AbilityContext, _hasAnyAbility } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
import {_getDatatable} from "@csrc/utility/Utils"
//************************************//
import {_activateTeamMember, _deactivateTeamMember, _deleteAdmin, _deleteResponsible} from '../../../redux/actions'
import CanCall from '../../../components/CanCall'
import BasicInfoModal from './BasicInfoModal'
//************************************//
const tableColumns = (state, _editBasicInfoModal, _deleteUser, _activate, _deactivate, hasAction) => [
  {
    name: 'ID',
    selector: 'id',
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: false
    }
  },
  {
    name: trans('user.fname'),
    selector: 'firstName',
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    name: trans('user.lname'),
    selector: 'lastName',
    sortable: false,
    minWidth: '225px',
    omit: true,
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    name: trans('user.name'),
    selector: 'name',
    sortable: false,
    grow: 1,
    // minWidth: '225px',
    filter: {
      enabled: false
    },
    cell: (row, index, column, id) => {
      return `${_.get(row, 'firstName')} ${_.get(row, 'lastName')}`
    }
  },
  {
    name: trans('user.email'),
    selector: 'email',
    sortable: true,
    // minWidth: '250px',
    filter: {
      enabled: true,
      type: 'text'
    }
  },
  {
    name: trans('gen.actions.actions'),
    allowOverflow: true,
    omit: !hasAction,
    grow: 0,
    cell: (row, index, column, id) => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <ActionDropdownToggle />
            <DropdownMenu right>
              <CanCall action='NoPermissionCode' id={`viewUser_${row.id}`}>
                <Link to={`/users/${row.id}`} className='w-100 dropdown-item' >
                  <Eye size={15} />
                  <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                </Link>
              </CanCall>
              {/*<CanCall action='NoPermissionCode' id={`updateUser_${row.id}`}>*/}
              {/*  <DropdownItem  className='w-100' onClick={e => _editBasicInfoModal(row)}>*/}
              {/*    <FileText size={15} />*/}
              {/*    <span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>*/}
              {/*  </DropdownItem>*/}
              {/*</CanCall>*/}

              {/*{row.active ? <CanCall action='NoPermissionCode' id={`deactivate_${row.id}`}>*/}
              {/*    <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deactivate(row.id)}>*/}
              {/*      <UserX size={15}/>*/}
              {/*      <span className='align-middle ml-50'>{trans('user.actions.deactivate')}</span>*/}
              {/*    </DropdownItem>*/}
              {/*  </CanCall> : <CanCall action='NoPermissionCode' id={`activate_${row.id}`}>*/}
              {/*    <DropdownItem className='w-100 btn-flat-success' onClick={e => _activate(row.id)}>*/}
              {/*      <UserCheck size={15}/>*/}
              {/*      <span className='align-middle ml-50'>{trans('user.actions.activate')}</span>*/}
              {/*    </DropdownItem>*/}
              {/*  </CanCall>}*/}

              {/*<CanCall action='NoPermissionCode' id={`deleteUser_${row.id}`}>*/}
              {/*  <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deleteUser(row.id)}>*/}
              {/*    <Trash size={15}/>*/}
              {/*    <span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>*/}
              {/*  </DropdownItem>*/}
              {/*</CanCall>*/}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
  }
]
const tableActions = ['NoPermissionCode']
//************************************//
class UserList extends Component {
  static contextType = AbilityContext
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}},
      types: [{label: trans('user.projectManager'), value: 1}, {label: trans('user.delegate'), value: 2}, {label: trans('user.responsible'), value: 3}]
    }
    this._editBasicInfoModal = this._editBasicInfoModal.bind(this)
    this._deleteUser = this._deleteUser.bind(this)
  }
  //************************************//
  _closeBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
  }
  //************************************//
  _openBasicInfoModal = () => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {types: this.state.types}}})
  }
  //************************************//
  _editBasicInfoModal = (data) => {
    this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {...data, types: this.state.types}}})
  }
  //************************************//
  _deleteUser = (id) => {
    _confirm({
      callback: (c) => {
        _deleteAdmin(id, () => {
          this.dataTableRef._refresh()
          c()
        })
      }
    })
  }
  //************************************//
  _activate = (id) => {
    _confirm({
      callback: (c) => {
        _activateTeamMember(id, () => {
          this.dataTableRef._refresh()
          c()
        })
      }
    })
  }
  //************************************//
  _deactivate = (id) => {
    _confirm({
      callback: (c) => {
        _deactivateTeamMember(id, () => {
          this.dataTableRef._refresh()
          c()
        })
      }
    })
  }
  //************************************//
  render () {
    const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
    const hasAction = _hasAnyAbility(this.context, tableActions)
    return (
      <Fragment>
        <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.nav.users')} breadCrumbParent='' breadCrumbActive='' >
          {/*<CanCall action='NoPermissionCode' id='addUserBtn'>*/}
          {/*  <Button.Ripple className='btn-icon' color='primary' onClick={this._openBasicInfoModal}>*/}
          {/*    <Plus size={14} />*/}
          {/*    <span className='ml-25'>{trans('gen.actions.add')}</span>*/}
          {/*  </Button.Ripple>*/}
          {/*</CanCall>*/}
        </Breadcrumbs>
        <Row>
          <Col sm='12'>
            <DataTable
              ref={(ref) => { this.dataTableRef = ref }}
              _fetchData={(params, callback) => _getDatatable('Managment/ReadUser', {...params, filter: {...params.filter, userType: 1, isDeleted: false}}, callback)}
              columns={tableColumns(this.state, this._editBasicInfoModal, this._deleteUser, this._activate, this._deactivate, hasAction)}
              hasIndexing={false}
              hasFilter={true}
            />
          </Col>
        </Row>
        {basicInfoModalShow && <BasicInfoModal  successCallback={this.dataTableRef._refresh} data={basicInfoModalData} onClose={this._closeBasicInfoModal}/>}
      </Fragment>
    )
  }
}
//************************************//
const mapStateToProps = store => ({
  loading: store.app.loading,
  userId: _.get(store, `${env('REACT_APP_AUTH_MODULE')}.userData.id`)
})
export default connect(mapStateToProps, null, null, { forwardRef: true })(UserList)
