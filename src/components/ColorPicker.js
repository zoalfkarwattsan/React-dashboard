import React, {useRef, useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAngleDown, faPalette, faFillDrip} from "@fortawesome/free-solid-svg-icons"
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs'
import {createElement} from "@syncfusion/ej2-base"
import {DropdownMenu, DropdownToggle, ButtonDropdown, Button} from 'reactstrap'
import Color from 'color'
import _ from 'lodash'
import classnames from 'classnames'
//************************************//
import {paletteColors} from "../assets/data/colors/palette"
//************************************//
const rgbToHex = (v) => {
  return Color(`rgb(${v})`).hex()
}
//************************************//
const hexToRgb = (v) => {
  return _.join(Color(v).rgb().array(), ',')
}
//************************************//
const ColorPicker = (props) => {
  const {
    color,
    mode = 'Palette',
    disabled = false,
    circleToggle = false,
    caret = true,
    onChange = (rgb) => {}
  } = props
  //************************************//
  const colorPickerRef = useRef()
  //************************************//
  const [defaultHex, setDefaultHex] = useState(rgbToHex(color))
  const [hex, setHex] = useState(rgbToHex(color))
  //************************************//
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [currentMode, setCurrentMode] = useState(mode)
  //************************************//
  const closeDropdown = () => {
    setHex(defaultHex)
    setDropdownOpen(false)
  }
  //************************************//
  const toggleDropdown = () => {
    if (dropdownOpen) {
      setHex(defaultHex)
    }
    setDropdownOpen(!dropdownOpen)
  }
  //************************************//
  const changeMode = () => {
    const nextMode = currentMode === 'Palette' ? 'Picker' : 'Palette'
    setCurrentMode(nextMode)
  }
  //************************************//
  const apply = (v = null) => {
    v = v === null ? hex : v
    setDefaultHex(v)
    setDropdownOpen(false)
    onChange(hexToRgb(v))

  }
  //************************************//
  const onSelect = (arg) => {
    setHex(arg.currentValue.hex)
    if (currentMode === 'Palette') {
      apply(arg.currentValue.hex)
    }
  }
  //************************************//
  const beforeCircleTileRender = (args) => {
    args.element.classList.add('e-circle-palette')
    if (args.value === hex) {
      args.element.classList.add('e-circle-active')
    }
    args.element.appendChild(createElement('span', { className: 'e-circle-selection' }))
  }
  //************************************//
  return (
    <div className={'color-picker-component'}>
      <ButtonDropdown
        disabled={disabled}
        isOpen={dropdownOpen}
        toggle={toggleDropdown}
        direction='left'
        setActiveFromChild={true}
      >
        <DropdownToggle
          color='flat-secondary'
          className={classnames('d-flex align-items-center btn-icon border shadow-lg', {'rounded-circle': circleToggle && !caret})}
          size='sm'
          style={{padding: 2}}
          disabled={disabled}
        >
          <div
            className={classnames({'rounded-circle': circleToggle})}
            style={{backgroundColor: hex, width: 20, height: 20}}
          />
          {
            caret &&
            <div className='px-25 border-left'>
              <FontAwesomeIcon icon={faAngleDown} size='sm'/>
            </div>
          }

        </DropdownToggle>
        <DropdownMenu className='p-0 shadow-none' >
          {
            dropdownOpen &&
            <ColorPickerComponent
              inline={true}
              showButtons={true}
              focusIn={true}
              enableOpacity={false}
              createPopupOnClick={true}
              modeSwitcher={false}
              mode={currentMode}
              columns={4}
              presetColors={paletteColors}
              ref={colorPickerRef}
              beforeTileRender={beforeCircleTileRender}
              value={defaultHex}
              select={onSelect}
            />
          }
          <div className='d-flex align-items-center justify-content-around py-50 border-top'>
            <Button.Ripple size='sm' color='flat-dark' className='p-50 btn-icon' onClick={changeMode}>
              <FontAwesomeIcon icon={currentMode !== 'Palette' ? faPalette : faFillDrip} size='lg'/>
            </Button.Ripple>
            {
              currentMode !== 'Palette' &&
              <div className='d-flex align-items-center'>
                <Button.Ripple size='sm' color='flat-primary' className='p-50' onClick={() => { apply() }}>
                  Apply
                </Button.Ripple>
                <Button.Ripple size='sm' color='flat-secondary' className='p-50' onClick={closeDropdown}>
                  Cancel
                </Button.Ripple>
              </div>
            }
          </div>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  )
}
export default ColorPicker
