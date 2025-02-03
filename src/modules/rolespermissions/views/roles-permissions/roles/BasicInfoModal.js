import React, {Fragment, useState} from 'react'
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
  InputGroupAddon, InputGroup, InputGroupText, Row, Col, FormFeedback, Table, UncontrolledTooltip, CustomInput
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'
import {ButtonSpinner, ErrorMessages} from '@src/components'
import {useTrans} from '@hooks/useTrans'

import {_addRole, _editRole} from "../../../redux/actions"
import Select from "react-select"
import {Info} from "react-feather"
import PermissionGroupCheckBox from "./PermissionGroupCheckBox"

const submitDataStructure = {
  id: "string",
  name: "string",
  normalizedName: "string",
  concurrencyStamp: "string"
}

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, register, setValue, getValues, trigger, control } = useForm()
  const isEditAction = _.size(props.data.id) > 0
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})
  const [search, setSearch] = useState('')

  const _close = () => {
    setOpen(false)
    props.onClose()
  }

  const onSubmit = async () => {
    const data = getValues()
    const cond = await trigger()
    if (!cond) {
      return
    }
    if (!_.isEmpty(errors)) {
      return
    }
    setValErrors({})
    if (isEditAction) {
      _editRole(
        {id:props.data.id, ...data},
        () => {
          props.successCallback()
          _close()
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
      _addRole(
        data,
        () => {
          props.successCallback()
          _close()
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
    }
  }

  return (
    <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
      <Modal
        scrollable
        isOpen={open}
        toggle={_close}
        unmountOnClose={true}
        backdrop={true}
        className='modal-lg'
        // contentClassName='p-0'
      >
        <ModalHeader toggle={_close} className='mb-1'>
          {trans(isEditAction ? 'user.actions.editRole' : 'user.actions.addRole')}
        </ModalHeader>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>
            <FormGroup>
              <Row>
                <Col xs={6} sm={6}>
                  <FormGroup>
                    <Label className='form-label' for='name'>
                      {trans('rolespermissions.inputs.name')}
                    </Label>
                    <Controller
                        as={Input}
                        control={control}
                        autoFocus
                        type='text'
                        id='name'
                        name='name'
                        rules={{
                          required: trans('user.validation.required')
                        }}
                        defaultValue={_.get(props, 'data.name') ?? ''}
                        className={classnames({ 'is-invalid': errors['name'] || _.get(valErrors, 'name')})}
                    />
                    <ErrorMessages valErrors={valErrors} errors={errors} name={'name'} />
                  </FormGroup>
                </Col>
                <Col xs={6} sm={6}>
                  <FormGroup>
                    <Label className='form-label' for='normalizedName'>
                      {trans('rolespermissions.inputs.normalizedName')}
                    </Label>
                    <Controller
                        as={Input}
                        control={control}
                        autoFocus
                        type='text'
                        id='normalizedName'
                        name='normalizedName'
                        rules={{
                          required: trans('user.validation.required')
                        }}
                        defaultValue={_.get(props, 'data.normalizedName') ?? ''}
                        className={classnames({ 'is-invalid': errors['normalizedName'] || _.get(valErrors, 'normalizedName')})}
                    />
                    <ErrorMessages valErrors={valErrors} errors={errors} name={'normalizedName'} />
                  </FormGroup>
                </Col>
                {/*<Col xs={6} sm={6}>*/}
                {/*  <FormGroup>*/}
                {/*    <Label className='form-label' for='concurrencyStamp'>*/}
                {/*      {trans('rolespermissions.inputs.concurrencyStamp')}*/}
                {/*    </Label>*/}
                {/*    <Controller*/}
                {/*        as={Input}*/}
                {/*        control={control}*/}
                {/*        autoFocus*/}
                {/*        type='text'*/}
                {/*        id='concurrencyStamp'*/}
                {/*        name='concurrencyStamp'*/}
                {/*        rules={{*/}
                {/*          required: trans('user.validation.required')*/}
                {/*        }}*/}
                {/*        defaultValue={_.get(props, 'data.concurrencyStamp') ?? ''}*/}
                {/*        className={classnames({ 'is-invalid': errors['concurrencyStamp'] || _.get(valErrors, 'concurrencyStamp')})}*/}
                {/*    />*/}
                {/*    <ErrorMessages valErrors={valErrors} errors={errors} name={'concurrencyStamp'} />*/}
                {/*  </FormGroup>*/}
                {/*</Col>*/}
              </Row>
            </FormGroup>
        </ModalBody>
        <ModalFooter className='justify-content-center'>
          <Button.Ripple type='submit' className='flex-grow-1' color='primary' onClick={onSubmit} disabled={loading}>
            { loading ? <ButtonSpinner/> : null}
            <span>{trans('gen.actions.save')}</span>
          </Button.Ripple>
          <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={_close}>
            <span>{trans('gen.actions.cancel')}</span>
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </Form>
  )
}

export default BasicInfoModal

