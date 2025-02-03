import React, {lazy, useEffect, useRef, useState} from 'react'
import {Card, ModalHeader, ModalBody, CardBody, UncontrolledDropdown, DropdownMenu, DropdownItem} from 'reactstrap'
import {ChevronDown} from 'react-feather'
import {useSelector} from 'react-redux'
import {SkeletonComponent} from "@syncfusion/ej2-react-notifications"
import DataTable from 'react-data-table-component'
import {ActionDropdownToggle} from '@src/components/datatable'

import {trans} from "@utils"
import PopUpModal from "./series-crud-modal"

import '@styles/react/libs/tables/react-dataTable-component.scss'
import {_getSeriesWithDetails} from "../../redux/actions"
import LoadingIndicator from "@csrc/components/LoadingIndicator"
import classnames from "classnames"
import _ from "lodash"

const SeriesContent = (props) => {
    const {categoryId} = props
    const {selectedSteps, setSelectedSteps} = props.selectedStepsState
    const {data, setData} = props.dataState

    const [modal, setModal] = useState({show: false, data: {}})
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        _getSeriesWithDetails(
            categoryId,
            data => {
                setData({refresh: false, data})
                setLoading(false)
            }
        )
    }, [])

    const paginationComponentOptions = {
        rowsPerPageText: trans('table.rowPerPage'),
        rangeSeparatorText: trans('table.of'),
        selectAllRowsItemText: trans('table.all'),
        selectAllRowsItem: true
    }

    const basicColumns = [
        {
            name: '#',
            cell: (row, index) => {
                return (rowsPerPage * (page - 1)) + index + 1
            },
            grow: 0,
            center: true,
            minWidth: '75px'
        },
        {
            name: trans('user.name'),
            selector: "name",
            sortable: false,
            omit: false,
            left: true,
            // grow: 0,
            cell: row => {
                const image = row.logo
                return (
                    <>
                        {image && (
                            <a className={'rounded-circle overflow-hidden'} href={image} target="_blank">
                                <img width={50} height={50} src={image} alt="Example Image" />
                            </a>
                        )}
                        <span className={'ml-50'}>{row.name}</span>
                    </>
                )
            }
        },
        {
            name: trans('user.description'),
            selector: "description",
            sortable: false,
            omit: false,
            grow: 3
        },
        {
            name: trans('user.startPrice'),
            selector: "startPrice",
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
                                <DropdownItem  className='w-100' onClick={e => setSelectedSteps(prevState => ({series: row}))}>
                                    <span className='align-middle'>{trans("gen.actions.view")}</span>
                                </DropdownItem>
                                <DropdownItem  className='w-100' onClick={e => {
                                    setModal({show: true, data: row})
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

    return (
        <LoadingIndicator loading={loading}>
            <ModalHeader className={classnames({hidden: !_.isEmpty(selectedSteps.series)})} toggle={props.close}>{trans('user.characteristics.series')}</ModalHeader>
            <ModalBody className={classnames({hidden: !_.isEmpty(selectedSteps.series)})}>
                <div className="react-dataTable-wrapper">
                    <DataTable
                        noHeader
                        striped
                        pagination
                        data={data.data}
                        columns={basicColumns}
                        className='react-dataTable'
                        highlightOnHover={true}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                        paginationPerPage={rowsPerPage}
                        paginationComponentOptions={paginationComponentOptions}
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        fixedHeader={true}
                    />
                </div>
            </ModalBody>
            {
                modal.show && (
                    <PopUpModal data={modal.data} successCallback={(data) => {
                        setData(prevState => {
                            const itemIndex = prevState.data.findIndex(x => x.id === modal.data.id)
                            prevState.data[itemIndex] = {...prevState.data.find(x => x.id === modal.data.id), ...data}
                            console.log(itemIndex, prevState.data[itemIndex])
                            return {
                                ...prevState,
                                refresh: !prevState.refresh
                            }
                        })
                    }} onClose={() => setModal({show: false, data: null})} />
                )
            }
        </LoadingIndicator>
    )
}

SeriesContent.propTypes = {}

export default SeriesContent
