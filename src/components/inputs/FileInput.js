import React, {Fragment, useRef, useState, useEffect} from "react"
import {ButtonGroup, Button, Label, Tooltip} from 'reactstrap'
import {Upload, Eye, Trash, RefreshCw} from 'react-feather'
//************************************//
import {trans, _url} from '@utils'
//************************************//
import UploadFile from "@src/components/inputs/UploadFile"
import {ButtonSpinner} from "@src/components"
//************************************//

const FileTooltip = ({ name, tooltip, show }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  if (!show) return null

  return (
    <Tooltip
      placement='top'
      isOpen={tooltipOpen}
      target={name}
      toggle={() => setTooltipOpen(!tooltipOpen)}
    >
      {tooltip}
    </Tooltip>
  )
}

const FileInput = (props) => {
  const {
    name,
    value,
    rules,
    size = 'sm',
    upload = true,
    preview = true,
    remove = true,
    reset = true,
    label = false,
    icon = true,
    outline = false,
    previewRef = null,
    onChange = (file) => {}
  } = props

  const ref = useRef()
  //!************************************!//
  const [oldValue, setOldValue] = useState(null)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const fileName = _.get(data, 'name')
  const updated = status === 'update'
  const deleted = status === 'delete'
  const iconSpacing = label ? { marginRight: 5 } : {}

  //!************************************!//
  const setPreviewRef = (previewRef) => {
    // work on it later
    // previewRef.src = 'ahmmed.png'
  }
  //!************************************!//
  const _onChooseFile = (file) => {
    setLoading(true)
    setData(file)

    if (previewRef) {
      setPreviewRef(previewRef.current)
    }
  }
  //!************************************!//
  const _onUploadFile = (file) => {
    setLoading(false)
    setStatus('update')
    onChange(file)
  }
  //!************************************!//
  const _onResetFile =  () => {
    setData('')
    setStatus('')
    onChange(oldValue || '')
  }
  //!************************************!//
  const _deleteFile = () => {
    setData('')
    setStatus('delete')
    onChange('delete')
  }

  useEffect(() => {
    setData(null)
    setStatus('')
    setOldValue(value)
  }, [])

  return (
    <div className="file-input-cont">
      <div className="file-input">
        <UploadFile rules={rules} ref={ref} onChoose={_onChooseFile} onReset={_onResetFile} onUploadSuccess={_onUploadFile}/>
        <ButtonGroup size={size}>
          {preview && (oldValue && !deleted) &&
          <Button tag={'a'} color='info' type='button' outline={outline} target={'_blank'} href={oldValue} disabled={loading} id={`tooltip-view-${name}`}>
            <span className="d-flex align-items-center">
              {icon &&
              <Fragment>
                <Eye size={14} style={{ ...iconSpacing }}/>
                <FileTooltip show={!label} name={`tooltip-view-${name}`} tooltip={trans('gen.actions.view')}/>
              </Fragment>}
              {(!icon || label) && trans('gen.actions.view')}
            </span>
          </Button>}
          {upload && <Button color='success' type='button' outline={outline} onClick={ () => { ref.current.handleClick() }} disabled={loading} id={`tooltip-upload-${name}`}>
            <span className="d-flex align-items-center">
              {loading ? <ButtonSpinner/> : null}
              {icon &&
              <Fragment>
                <Upload size={14} style={{ ...iconSpacing }}/>
                <FileTooltip show={!label} name={`tooltip-upload-${name}`} tooltip={trans('gen.actions.upload')}/>
              </Fragment>}
              {(!icon || label) && trans('gen.actions.upload')}
            </span>
          </Button>}
          {reset && ((!oldValue && data) || (oldValue && deleted) || (oldValue && updated)) &&
          <Button color='warning' type='button' outline={outline} onClick={_onResetFile} disabled={loading} id={`tooltip-reset-${name}`}>
            <span className="d-flex align-items-center">
              {icon &&
              <Fragment>
                <RefreshCw size={14} style={{ ...iconSpacing }}/>
                <FileTooltip show={!label} name={`tooltip-reset-${name}`} tooltip={trans('gen.actions.reset')}/>
              </Fragment>}
              {(!icon || label) && trans('gen.actions.reset')}
            </span>
          </Button>}
          {remove && ((oldValue && !deleted) || (oldValue && updated)) &&
          <Button color='danger' type='button' outline={outline} onClick={_deleteFile} disabled={loading} id={`tooltip-delete-${name}`}>
            <span className="d-flex align-items-center">
              {icon &&
              <Fragment>
                <Trash size={14} style={{ ...iconSpacing }}/>
                <FileTooltip show={!label} name={`tooltip-delete-${name}`} tooltip={trans('gen.actions.delete')}/>
              </Fragment>}
              {(!icon || label) && trans('gen.actions.delete')}
            </span>
          </Button>}
        </ButtonGroup>
      </div>
      {fileName && <Label className={'text-muted mb-0'}>{fileName}</Label>}
    </div>
  )
}

export default FileInput
