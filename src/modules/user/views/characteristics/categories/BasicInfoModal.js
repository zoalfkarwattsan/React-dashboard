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
  _editCategory,
  _getAllResponsiblesWithQ,
  _getAllRolesWithQ
} from "../../../redux/actions"
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

  const _close = () => {
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
      _editCategory(
        {...props.data, ...data},
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
      toggle={_close}
      unmountOnClose={true}
      backdrop={true}
      className='sidebar-lg'
      contentClassName='p-0'
      modalClassName='modal-slide-in sidebar-todo-modal'
    >
      <Form action='/public' className='flex-grow-1 d-flex flex-column' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={_close} className='mb-1'>
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
            <Label className='form-label' for='summary'>
              {trans('user.summary')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='text'
              id='summary'
              name='summary'
              rules={{
                // required: trans('user.validation.required')
              }}
              defaultValue={_.get(props, 'data.summary') ?? ''}
              className={classnames({ 'is-invalid': errors['summary'] || _.get(valErrors, 'summary') })}
            />
            <ErrorMessages valErrors={valErrors} errors={errors} name={'summary'} />
          </FormGroup>

          <FormGroup>
            <Label className='form-label' for='order'>
              {trans('user.order')}
            </Label>
            <Controller
              as={Input}
              control={control}
              type='text'
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
          <Button.Ripple type='button' className='flex-grow-1' color='secondary' disabled={loading} onClick={_close}>
            <span>{trans('gen.actions.cancel')}</span>
          </Button.Ripple>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default BasicInfoModal

