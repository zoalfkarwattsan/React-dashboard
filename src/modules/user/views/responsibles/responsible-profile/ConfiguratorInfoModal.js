import React, {useState} from 'react'
import classnames from 'classnames'
import 'cleave.js/dist/addons/cleave-phone.us'
import {
    Container,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Card,
    CardHeader,
    CardBody
} from 'reactstrap'
import _ from "lodash"

import {trans} from '@utils'

const DetailsModal = (props) => {
    const data = props.data

    const [open, setOpen] = useState(true)
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
            <ModalHeader toggle={close}>
                {trans('user.characteristics.configuratorInfo')}
            </ModalHeader>
            <ModalBody>
                <Container fluid={true}>
                    <Row className={'match-height'}>
                        {_.filter(data, (x, key) => _.endsWith(key, 'Char')).map((item, index) => {
                            return (
                                <Col key={index} xl={3} md={6}>
                                    <Card>
                                        <CardBody>
                                            <div className='d-flex justify-content-between'>
                                                <h4>{_.startCase(item?.code)}</h4>
                                            </div>
                                            <div className='d-flex align-items-start mt-1 pt-25'>
                                                <div className='role-heading w-50'>
                                                    <h6 className='fw-bolder'>{item?.name}</h6>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </ModalBody>
        </Modal>
    )
}

export default DetailsModal

