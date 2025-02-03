import React from 'react'
import {Modal, ModalHeader, ModalFooter, Button, ModalBody} from 'reactstrap'

import {trans} from '@utils'
import {getFeatures} from "../../utility/Utils"

const UnAvailableFeatureModal = (props) => {
  const features = getFeatures()
  const {featureKey, onClose} = props

  const feature = _.get(features, featureKey, null)

  return (
    <Modal
      isOpen={true}
      toggle={onClose}
      unmountOnClose={true}
      backdrop={true}
      className='modal-md modal-dialog-centered'
      modalClassName={''}
    >
      <ModalHeader toggle={onClose}>
        {feature.title()}
      </ModalHeader>
      <ModalBody>
        {
          React.cloneElement(feature.component, {onClickUpgradeBtn: onClose, ...props})
        }
      </ModalBody>
      <ModalFooter>
        <Button.Ripple type='button' color='flat-secondary' onClick={onClose}>
          <span>{trans('gen.actions.cancel')}</span>
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}
//************************************//
export default UnAvailableFeatureModal
