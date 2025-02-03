import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Modal, ModalHeader, ModalBody} from 'reactstrap'
import {useSelector} from 'react-redux'

import LoadingIndicator from "./LoadingIndicator"

const ModalWrapper = props => {
  const modalProps = {...props}
  const showLoader = modalProps.showLoader
  const title = modalProps.title
  delete modalProps.showLoader
  delete modalProps.title

  const loadingRedux = useSelector(state => state.app.loading)
  const [initLoading, setInitLoading] = useState(loadingRedux)
  const [show, setShow] = useState(!showLoader)
  const [firstAccess, setFirstAccess] = useState(true)

  useEffect(() => {
    if (firstAccess) {
      if (loadingRedux) {
        setFirstAccess(false)
      }
    } else {
      if (!loadingRedux && !show) {
        setShow(true)
      }
    }
    }, [loadingRedux])

  return (
    <Modal {...modalProps} toggle={!show ? modalProps.toggle : () => {}}>
      {
        title ? (
          !show ? (
            <>
              <ModalHeader>
                {title}
              </ModalHeader>
              <LoadingIndicator loading={true} />
            </>
          ) : (
            props.children
          )
        ) : (
          <LoadingIndicator loading={!show}>
            {props.children}
          </LoadingIndicator>
        )
      }
    </Modal>
  )
}

ModalWrapper.propTypes = {

}

export default ModalWrapper
