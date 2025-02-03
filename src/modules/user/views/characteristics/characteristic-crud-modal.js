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
import Select from 'react-select'

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {
    _addAdmin,
    _editAdminInfo,
    _editCategory, _editSeries, _editStaticCharacteristic,
    _getAllResponsiblesWithQ,
    _getAllRolesWithQ
} from "../../redux/actions"
import AsyncSelect from "react-select/async"

const submitDataStructure = {
    id: 0,
    name: "string",
    summary: "string",
    order: 0,
    isActive: true
}

const isActiveOptions = [
    {label: trans('user.yes'), value: true},
    {label: trans('user.no'), value: false}
]

const BasicInfoModal = (props) => {

    const loading = useSelector(state => state.app.loading)
    const { errors, handleSubmit, control } = useForm()
    const isEditAction = _.size(`${props.data.id}`) > 0
    const [open, setOpen] = useState(true)
    const [valErrors, setValErrors] = useState({})

    const close = () => {
        setOpen(false)
        props.onClose()
    }

    const onSubmit = (data) => {
        if (!_.isEmpty(errors)) {
            return
        }
        setValErrors({})
        data.isActive = data.isActive.value
        if (isEditAction) {
            _editStaticCharacteristic(
                {...props.data, ...data},
                (data) => {
                    props.successCallback(_.get(data, '0'))
                    close()
                },
                (err) => {
                    if (err) {
                        const arr = {}
                        for (const f in err) {
                            if (err[f] !== null) arr[f] = err[f][0]
                        }
                        setValErrors(arr)
                    }
                }
            )
        } else {
            // _addAdmin(
            //   data,
            //   () => {
            //     props.successCallback()
            //     _close()
            //   },
            //   (err) => {
            //     if (err) {
            //       const arr = {}
            //       for (const f in err) {
            //         if (err[f] !== null) arr[f] = err[f][0]
            //       }
            //       setValErrors(arr)
            //     }
            //   }
            // )
        }
    }

    return (
        <Modal
            isOpen={open}
            toggle={close}
            unmountOnClose={true}
            backdrop={true}
            className='sidebar-lg'
            contentClassName='p-0'
            modalClassName='modal-slide-in sidebar-todo-modal'
        >
            <Form action='/public' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader toggle={close} className='mb-1'>
                    {trans(isEditAction ? 'user.actions.editAdmin' : 'user.actions.addAdmin')}
                </ModalHeader>
                <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>

                    <FormGroup>
                        <Label className='form-label' for='name'>
                            {trans('user.name')}
                        </Label>
                        <Controller
                            as={Input}
                            control={control}
                            type='text'
                            id='name'
                            name='name'
                            rules={{
                                required: trans('user.validation.required')
                            }}
                            defaultValue={_.get(props, 'data.name') ?? ''}
                            className={classnames({ 'is-invalid': errors['name'] || _.get(valErrors, 'name') })}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'name'} />
                    </FormGroup>

                    <FormGroup>
                        <Label className='form-label' for='price'>
                            {trans('user.price')}
                        </Label>
                        <Controller
                            as={Input}
                            control={control}
                            type='number'
                            id='price'
                            name='price'
                            rules={{
                                required: trans('user.validation.required')
                            }}
                            defaultValue={_.get(props, 'data.price') ?? ''}
                            className={classnames({ 'is-invalid': errors['price'] || _.get(valErrors, 'price') })}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'price'} />
                    </FormGroup>

                    <FormGroup>
                        <Label className='form-label' for='order'>
                            {trans('user.order')}
                        </Label>
                        <Controller
                            as={Input}
                            control={control}
                            type='number'
                            id='order'
                            name='order'
                            rules={{
                                required: trans('user.validation.required')
                            }}
                            defaultValue={_.get(props, 'data.order') ?? ''}
                            className={classnames({ 'is-invalid': errors['order'] || _.get(valErrors, 'order') })}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'order'} />
                    </FormGroup>

                    <FormGroup>
                        <Label className='form-label' for='isActive'>
                            {trans('user.isActive')}
                        </Label>
                        <Controller
                            as={Select}
                            control={control}
                            type='text'
                            id='isActive'
                            name='isActive'
                            rules={{
                                required: trans('user.validation.required')
                            }}
                            options={isActiveOptions}
                            defaultValue={_.get(props, 'data.isActive') ? isActiveOptions[0] : isActiveOptions[1]}
                            className={classnames({ 'is-invalid': errors['isActive'] || _.get(valErrors, 'isActive') })}
                        />
                        <ErrorMessages valErrors={valErrors} errors={errors} name={'isActive'} />
                    </FormGroup>

                </ModalBody>
                <ModalFooter className='justify-content-center'>
                    <Button.Ripple type='submit' className='flex-grow-1' color='primary' disabled={loading}>
                        { loading ? <ButtonSpinner/> : null}
                        <span>{trans('gen.actions.save')}</span>
                    </Button.Ripple>
                    <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={close}>
                        <span>{trans('gen.actions.cancel')}</span>
                    </Button.Ripple>
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default BasicInfoModal

