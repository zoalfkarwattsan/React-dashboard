import React, {lazy, useEffect, useRef, useState} from 'react'
import {Card, ModalHeader, ModalBody, CardBody, UncontrolledDropdown, DropdownMenu, DropdownItem, Button, Badge} from 'reactstrap'
import {ChevronDown, ArrowLeft, ChevronRight} from 'react-feather'
import {useSelector} from 'react-redux'
import {SkeletonComponent} from "@syncfusion/ej2-react-notifications"
import DataTable from 'react-data-table-component'
import {ActionDropdownToggle} from '@src/components/datatable'

import {trans} from "@utils"
import SerieCharacteristicCrudModal from "./serie-characteristic-crud-modal"
import CharacteristicCrudModal from "./characteristic-crud-modal"

import '@styles/react/libs/tables/react-dataTable-component.scss'
import {_getSeriesWithDetails} from "../../redux/actions"
import LoadingIndicator from "@csrc/components/LoadingIndicator"

const CharacteristicRelationsContent = (props) => {
    const {categoryId} = props
    const {selectedSteps, setSelectedSteps} = props.selectedStepsState

    const [serieCharacteristicModal, setSerieCharacteristicModal] = useState({show: false, data: {}})
    const [characteristicModal, setCharacteristicModal] = useState({show: false, data: {}})
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [data, setData] = useState(selectedSteps?.characteristic?.staticCharacteristic?.affectedCharacteristicsList)

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
            omit: false
        },
        {
            name: trans('user.code'),
            selector: "code",
            sortable: false,
            omit: false
        },
        // {
        //     name: trans('user.unit'),
        //     selector: "unit",
        //     sortable: false,
        //     omit: false
        // },
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
            omit: true,
            cell: (row) => {
                return (
                    <div className="d-flex align-items">
                        <UncontrolledDropdown>
                            <ActionDropdownToggle/>
                            <DropdownMenu right>
                                <DropdownItem  className='w-100' onClick={e => setSelectedSteps(prevState => ({...prevState, characteristic: row}))}>
                                    <span className='align-middle'>{trans("gen.actions.view")}</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={e => {
                                    setSerieCharacteristicModal({show: true, data: row})
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
        <>
            <ModalHeader toggle={props.close}>
                <Button.Ripple className={'btn-icon mr-50'} size={'sm'} color={'flat-secondary'} onClick={e => { setSelectedSteps(prevState => ({...prevState, characteristic: {}})) }}>
                    <ArrowLeft size={12} />
                </Button.Ripple>
                <span>
                    {selectedSteps?.series?.name}
                </span>
                <ChevronRight className={'mx-50'} size={12} />
                <span>
                    {selectedSteps?.characteristic?.staticCharacteristic?.name}
                </span>
                <ChevronRight className={'mx-50'} size={12} />
                <span>
                    {trans('user.characteristics.relations')}
                </span>
            </ModalHeader>
            <ModalBody>
                <div className="react-dataTable-wrapper">
                    <DataTable
                        noHeader
                        striped
                        pagination
                        data={data}
                        columns={basicColumns}
                        className='react-dataTable'
                        highlightOnHover={true}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                        paginationPerPage={rowsPerPage}
                        paginationComponentOptions={paginationComponentOptions}
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </div>
            </ModalBody>
            {
                serieCharacteristicModal.show && (
                    <SerieCharacteristicCrudModal data={serieCharacteristicModal.data} onClose={() => setSerieCharacteristicModal({show: false, data: null})} />
                )
            }
            {
                characteristicModal.show && (
                    <CharacteristicCrudModal data={characteristicModal.data} onClose={() => setCharacteristicModal({show: false, data: null})} />
                )
            }
        </>
    )
}

CharacteristicRelationsContent.propTypes = {}

export default CharacteristicRelationsContent
