import React, {useEffect, useState} from 'react'
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

import {_addAdmin, _editAdminInfo} from "../../../redux/actions"
import Select from "react-select"

const submitDataStructure = {
  id: "string",
  userName: "string",
  email: "string",
  firstName: "string",
  lastName: "string",
  phoneNumber: "string",
  password: "string",
  rolesIDs: ["string"]
}

const BasicInfoModal = (props) => {

  const loading = useSelector(state => state.app.loading)
  const { errors, handleSubmit, control } = useForm()
  const isEditAction = _.size(props.data.id) > 0
  const [open, setOpen] = useState(true)
  const [valErrors, setValErrors] = useState({})
  // const strongPasswordRegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

  const _close = () => {
    setOpen(false)
    props.onClose()
  }

  const onSubmit = (data) => {
    if (!_.isEmpty(errors)) {
      return
    }
    setValErrors({})
    if (_.isEmpty(data.password)) {
      delete data.password
    }
    data.rolesIDs = _.map(data.rolesIDs, role => role.value)
    data.userType = 1
    data.userName = data.email
    if (isEditAction) {
      _editAdminInfo(
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
      _addAdmin(
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
      <Modal
          isOpen={open}
          toggle={_close}
          unmountOnClose={true}
          backdrop={true}
          className='sidebar-lg'
          contentClassName='p-0'
          modalClassName='modal-slide-in sidebar-todo-modal'
      >
        <Form action='/' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={_close} className='mb-1'>
            {trans(isEditAction ? 'user.actions.editAdmin' : 'user.actions.addAdmin')}
          </ModalHeader>
          <ModalBody className='flex-grow-1 pb-sm-0 pb-3 modal-body'>

            <FormGroup>
              <Label className='form-label' for='firstName'>
                {trans('user.fname')}
              </Label>
              <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  id='firstName'
                  name='firstName'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.firstName') ?? ''}
                  className={classnames({ 'is-invalid': errors['firstName'] || _.get(valErrors, 'firstName')})}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'firstName'} />
            </FormGroup>

            <FormGroup>
              <Label className='form-label' for='lastName'>
                {trans('user.lname')}
              </Label>
              <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='text'
                  id='lastName'
                  name='lastName'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.lastName') ?? ''}
                  className={classnames({ 'is-invalid': errors['lastName'] || _.get(valErrors, 'lastName')})}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'lastName'} />
            </FormGroup>

            <FormGroup>
              <Label className='form-label' for='phoneNumber'>
                {trans('user.mobile')}
              </Label>
              <Controller
                  as={Input}
                  control={control}
                  autoFocus
                  type='number'
                  id='phoneNumber'
                  name='phoneNumber'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.phoneNumber') ?? ''}
                  className={classnames({ 'is-invalid': errors['phoneNumber'] || _.get(valErrors, 'phoneNumber')})}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'phoneNumber'} />
            </FormGroup>

            <FormGroup>
              <Label className='form-label' for='email'>
                {trans('user.email')}
              </Label>
              <Controller
                  as={Input}
                  control={control}
                  type='email'
                  placeholder={useTrans('user.email')}
                  id='email'
                  name='email'
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={_.get(props, 'data.email') ?? ''}
                  className={classnames({ 'is-invalid': errors['email'] || _.get(valErrors, 'email') })}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'email'} />
            </FormGroup>

            <FormGroup>
              <Label className='form-label' for='password'>
                {trans('user.password')}
              </Label>
              <Controller
                  as={Input}
                  control={control}
                  type='password'
                  id='new-password'
                  name='password'
                  placeholder={useTrans('user.password')}
                  rules={{
                    required: trans('user.validation.required')
                  }}
                  defaultValue={''}
                  className={classnames({ 'is-invalid': errors['password'] || _.get(valErrors, 'password') })}
              />
              <ErrorMessages valErrors={valErrors} errors={errors} name={'password'} />
            </FormGroup>

          </ModalBody>
          <ModalFooter className='justify-content-center'>
            <Button.Ripple type='submit' className='flex-grow-1' color='primary' disabled={loading}>
              { loading ? <ButtonSpinner/> : null}
              <span>{trans('gen.actions.save')}</span>
            </Button.Ripple>
            <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={_close}>
              <span>{trans('gen.actions.cancel')}</span>
            </Button.Ripple>
          </ModalFooter>
        </Form>
      </Modal>
  )
}

export default BasicInfoModal

