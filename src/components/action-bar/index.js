import React, {useState, useImperativeHandle} from 'react'
import classnames from "classnames"
import {Button} from 'reactstrap'
import {X} from 'react-feather'

import {CanCall} from "@modules/user"

//************************************//
const RenderButton = (props) => {
  const {button, setShow, className} = props
  if (button.action !== undefined) {
    return (
      <CanCall action={button.action}>
        <Button size={'sm'} color={'white'} disabled={button.disabled} onClick={(e) => {
          button.onClick(e)
          if (button.closeOnClick) {
            setShow(false)
          }
        }} className={classnames(`${className} align-items-center`, {hidden: button.hidden, 'd-flex': !button.hidden})}>
          {button.icon}
          <span className={'ml-25'}>{button.title}</span>
        </Button>
      </CanCall>
    )
  } else {
    return (
      <Button size={'sm'} color={'white'} disabled={button.disabled} onClick={button.onClick} className={classnames(`${className} align-items-center`, {hidden: button.hidden, 'd-flex': !button.hidden})}>
        {button.icon}
        <span className={'ml-25'}>{button.title}</span>
      </Button>
    )
  }
}
//************************************//
const ActionBar = React.forwardRef((props, ref) => {
  //************************************//
  const [show, setShow] = useState(props.initShow)
  //************************************//
  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
    },
    hide() {
      setShow(false)
    },
    getVisibility() {
      return show
    }
  }))

  //************************************//
  const {
    onClose = () => {},
    numOfSelected = 0,
    btnProps = {},
    buttons = []
  } = props
  //************************************//
  return (
    <div
      className={classnames(`action-bar-wrapper bottom-0 px-2 w-100 bg-primary`, {'fixed-bottom': show, hidden: !show})}
      style={{height: 45, zIndex: 1030}}
    >
      <div className={'position-relative h-100 w-100 d-flex justify-content-between align-items-center'}>
        <div>
          <span className={'text-white font-weight-bolder'}>
            {numOfSelected} items selected
          </span>
        </div>
        <div className={'d-flex justify-content-end align-items-between mr-1 flex-1'}>
          {
            _.map(buttons, (button, i) => <RenderButton button={button} className={i > 0 ? 'ml-25' : ''} key={i} setShow={setShow}/>)
          }
        </div>
        <div>
          <Button className={'btn-icon ml-50 rounded-circle'} size={'sm'} color={'white'} onClick={onClose} {...btnProps}>
            <X size={10}/>
          </Button>
        </div>
      </div>
      <div className={'hidden'}>
        {props.children}
      </div>
    </div>
  )
})

ActionBar.propTypes = {}

export default ActionBar
