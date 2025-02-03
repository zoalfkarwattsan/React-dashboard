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
import BasicInfoModal from './characteristic-crud-modal'
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
        name: trans('user.name'),
        selector: "name",
        sortable: false,
        omit: false,
        filter:{
            enabled: true,
            type: 'text'
        }
    },
    {
        name: trans('user.code'),
        selector: "code",
        sortable: false,
        omit: false,
        filter:{
            enabled: true,
            type: 'text'
        }
    },
    {
        name: trans('user.unit'),
        selector: "unit",
        sortable: false,
        omit: false
    },
    {
        name: trans('user.price'),
        selector: "price",
        sortable: false,
        omit: false
    },
    {
        name: trans('gen.actions.actions'),
        allowOverflow: true,
        grow: 0,
        center: true,
        omit: false,
        cell: (row) => {
            return (
                <div className="d-flex align-items">
                    <UncontrolledDropdown>
                        <ActionDropdownToggle/>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={e => {
                                _editBasicInfoModal(row)
                            }}>
                                <span className='align-middle'>{trans("gen.actions.edit")}</span>
                            </DropdownItem>
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
            basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}
        }
    }
    //************************************//
    _closeBasicInfoModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
    }
    //************************************//
    _openBasicInfoModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {}}})
    }
    //************************************//
    _editBasicInfoModal = (data) => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
    }
    //************************************//
    render () {
        const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
        const hasAction = _hasAnyAbility(this.context, tableActions)
        return (
            <Fragment>
                <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.characteristics.characteristics')} breadCrumbParent='' breadCrumbActive='' >
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
                            _fetchData={(params, callback) => _getDatatable('StaticCharacteristic/Read', params, callback)}
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
