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
import {_activateTeamMember, _deactivateTeamMember, _deleteResponsible} from '../../../redux/actions'
import CanCall from '../../../components/CanCall'
import BasicInfoModal from './BasicInfoModal'
import DetailsModal from "../details-modal"
//************************************//
const tableColumns = (state, view, edit, hasAction) => [
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
        selector: 'name',
        sortable: false,
        grow: 1,
        // minWidth: '225px',
        filter: {
            enabled: false
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
                            <CanCall action='NoPermissionCode' id={`view_${row.id}`}>
                                <DropdownItem  className='w-100' onClick={e => view(row.id)}>
                                    <Eye size={15} />
                                    <span className='align-middle ml-50'>{trans('gen.actions.view')}</span>
                                </DropdownItem>
                            </CanCall>
                            <CanCall action='NoPermissionCode' id={`edit_${row.id}`}>
                                <DropdownItem  className='w-100' onClick={e => edit(row)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>{trans('gen.actions.edit')}</span>
                                </DropdownItem>
                            </CanCall>

                            {/*<CanCall action='NoPermissionCode' id={`deleteUser_${row.id}`}>*/}
                            {/*    <DropdownItem className='w-100 btn-flat-danger' onClick={e => _deleteUser(row.id)}>*/}
                            {/*        <Trash size={15}/>*/}
                            {/*        <span className='align-middle ml-50'>{trans('gen.actions.delete')}</span>*/}
                            {/*    </DropdownItem>*/}
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
            detailsModal: {detailsModalShow: false, detailsModalData: {}}
        }
    }
    //************************************//
    closeBasicInfoModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: false, basicInfoModalData: {}}})
    }
    //************************************//
    openBasicInfoModal = () => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: {}}})
    }
    //************************************//
    editBasicInfoModal = (data) => {
        this.setState({basicInfoModal: {basicInfoModalShow: true, basicInfoModalData: data}})
    }
    //************************************//
    closeDetailsModal = () => {
        this.setState({detailsModal: {detailsModalShow: false, detailsModalData: {}}})
    }
    //************************************//
    openDetailsModal = (categoryId) => {
        this.setState({detailsModal: {detailsModalShow: true, detailsModalData: {categoryId}}})
    }
    //************************************//
    deleteUser = (id) => {
        _confirm({
            callback: (c) => {
                _deleteResponsible(id, () => {
                    this.dataTableRef._refresh()
                    c()
                })
            }
        })
    }
    //************************************//
    render () {
        const {basicInfoModalShow, basicInfoModalData} = this.state.basicInfoModal
        const {detailsModalShow, detailsModalData} = this.state.detailsModal
        const hasAction = _hasAnyAbility(this.context, tableActions)
        return (
            <Fragment>
                <Breadcrumbs breadCrumbMainTitle={''} breadCrumbTitle={trans('user.characteristics.categories')} breadCrumbParent='' breadCrumbActive='' >
                    {/*<CanCall action='NoPermissionCode' id='addUserBtn'>*/}
                    {/*    <Button.Ripple className='btn-icon' color='primary' onClick={this.openBasicInfoModal}>*/}
                    {/*        <Plus size={14} />*/}
                    {/*        <span className='ml-25'>{trans('gen.actions.add')}</span>*/}
                    {/*    </Button.Ripple>*/}
                    {/*</CanCall>*/}
                </Breadcrumbs>
                <Row>
                    <Col sm='12'>
                        <DataTable
                            ref={(ref) => { this.dataTableRef = ref }}
                            _fetchData={(params, callback) => _getDatatable('Categories/Read', {...params, filter: {...params.filter}}, callback)}
                            columns={tableColumns(this.state, this.openDetailsModal, this.editBasicInfoModal, hasAction)}
                            hasIndexing={false}
                            hasFilter={false}
                        />
                    </Col>
                </Row>
                {detailsModalShow && <DetailsModal successCallback={() => {}} data={detailsModalData} onClose={this.closeDetailsModal}/>}
                {basicInfoModalShow && <BasicInfoModal successCallback={this.dataTableRef._refresh} data={basicInfoModalData} onClose={this.closeBasicInfoModal}/>}
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
