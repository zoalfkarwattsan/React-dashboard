import React, {useState} from 'react'
import classnames from 'classnames'
import {Controller, useForm} from 'react-hook-form'
import { useSelector } from 'react-redux'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import {
    FormGroup,
    Label,
    Button,
    Form,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    InputGroupAddon, InputGroup, InputGroupText, Col
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addAdmin, _editAdminInfo, _getAllResponsiblesWithQ, _getAllRolesWithQ} from "../../redux/actions"
import AsyncSelect from "react-select/async"
import SeriesContent from "./series-content"
import CharacteristicsContent from "./characteristics-content"
import CharacteristicRelationsContent from "./characteristic-relations-content"

const DetailsModal = (props) => {
    const {categoryId} = props.data

    const [open, setOpen] = useState(true)
    const [data, setData] = useState({refresh: true, data: []})
    const [selectedSteps, setSelectedSteps] = useState({
        series: {},
        characteristic: {}
    })

    const close = () => {
        setOpen(false)
        props.onClose()
    }

    return (
        <Modal
            isOpen={open}
            toggle={close}
            unmountOnClose={true}
            backdrop={true}
            className='modal-xl'
            contentClassName='p-0'
            modalClassName=''
            scrollable
        >
            <SeriesContent dataState={{data, setData}} selectedStepsState={{selectedSteps, setSelectedSteps}} categoryId={categoryId} close={close} />
            {
                !_.isEmpty(selectedSteps.series) && (
                    <CharacteristicsContent dataState={{data, setData}} selectedStepsState={{selectedSteps, setSelectedSteps}} close={close} />
                )
            }
            {
                !_.isEmpty(selectedSteps.characteristic) && (
                    <CharacteristicRelationsContent selectedStepsState={{selectedSteps, setSelectedSteps}} close={close} />
                )
            }
        </Modal>
    )
}

export default DetailsModal

