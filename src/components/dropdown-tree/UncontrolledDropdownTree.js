import React, {Fragment, useRef, useState, useEffect} from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Spinner,
  Button
} from 'reactstrap'
import {ChevronDown, ChevronRight, ArrowLeft, Search, Tag} from 'react-feather'
import Proptypes from 'prop-types'
import classNames from 'classnames'
//************************************//
import {trans, uuidv4} from '@utils'
import InputContainer from "@src/components/helpers/InputContainer"
//************************************//
import LoadingIndicator from "../LoadingIndicator"
//************************************//
import '../../assets/scss/dropdown-tree.scss'
//************************************//
const UncontrolledDropdownTree = ({ value, onChange, className, loadOptions, delaySearch, multi, group, clearable, groupOptionFormat, optionFormatter, dropdownOptions }) => {
  const dropdownOptionsDefault = {
    dropdownDirection: 'down',
    dropdownClassName: '',
    dropdownMenuFlip: true,
    dropdownMenuHeight: '250px',
    showDropdownLeafIcon: true,
    dropdownLeafCustomIcon: Tag,
    ...dropdownOptions
  }
  const {dropdownDirection, dropdownClassName, dropdownMenuHeight, dropdownMenuFlip, showDropdownLeafIcon, dropdownLeafCustomIcon} = dropdownOptionsDefault
  //************************************//
  const dropdownMenuRef = useRef(null)
  //************************************//
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [clearSelectedOptions, setClearSelectedOptions] = useState(false)
  const [restrictedOptions, setRestrictedOptions] = useState([])
  //************************************//
  const [search, setSearch] = useState({
    label: '',
    loading: false
  })
  const [headerTitles, setHeaderTitles] = useState([])
  const [currentOptions, setCurrentOptions] = useState(null)
  const [prevOptions, setPrevOptions] = useState([])
  const [memoOptions, setMemoOptions] = useState({})
  //************************************//
  const selectedOptionsLabels = _.map(selectedOptions, item => item.label)
  //************************************//
  const optionFormatterCallback = (option) => {
    const defaultProps = {
      value: '',
      label: '',
      hasChildren: false,
      ancestors: [],
      fixed: false,
      canSelect: true
    }
    if (group) {
      defaultProps.groupCode = ''
      defaultProps.groupLabel = ''
    }
    return {
      ...defaultProps,
      ...optionFormatter(option)
    }
  }
  const groupOptionFormatterCallback = (data) => {
    const groupOptions = []
    _.forEach(data, group => _.forEach(group.data, option => {
      const objectFormat = groupOptionFormat[group.type]
      const {groupCode, optionsMap} = objectFormat
      const {value = '', label = '', fixed = '', ...restProps} = optionsMap
      const valueEval = _.get(option, value)
      const labelEval = _.get(option, label)
      const fixedEval = _.get(option, fixed)
      const restPropsEval = {}
      _.forEach(restProps, (col, index) => {
        restPropsEval[index] = option[col]
      })
      groupOptions.push({
        groupCode: group.type,
        groupLabel: group.title,
        value: valueEval ? `${groupCode}_${valueEval}` : '',
        label: labelEval ?? '',
        fixed: fixedEval ?? false,
        ...restPropsEval
      })
    }))
    return groupOptions
  }
  const grapValue = (data) => {
    return _.map(data, (item) => item.value)
  }
  const setInitRestrictedOptions = (data) => {
    _.forEach(data, (selectedOption) => {
      const data = _.map(selectedOption.ancestors, ancestorOption => ({ ...optionFormatterCallback(ancestorOption), access_filter: selectedOption.value }))
      setRestrictedOptions((restrictedOptions) => ([...restrictedOptions, ...data]))
    })
  }
  const loadFixedSelectedOptions = (data) => {
    if (multi) {
      const fixedOptions = _.filter(data, option => option.fixed)
      // todo: this need test with backend please provide real backend example
      //       because it's cause issue if it apply fixed option
      if (fixedOptions.length > 0) {
        const fixedOptionsFormatted = _.filter(_.map(fixedOptions, option => optionFormatterCallback(option)), item => item.fixed)
        const selectedOptionsDuplicateFiltered = _.filter(selectedOptions, selectedOption => !_.find(fixedOptionsFormatted, fixedOption => fixedOption.value === selectedOption.value))
        setSelectedOptions([...selectedOptionsDuplicateFiltered, ...fixedOptionsFormatted])
        setInitRestrictedOptions([...selectedOptionsDuplicateFiltered, ...fixedOptionsFormatted])
      }
    }
  }
  const forceUpdate = () => {
    dropdownMenuRef?.current?._reactInternals?.child?.lastEffect?.stateNode?.popperInstance?.scheduleUpdate()
  }
  const checkedEvaluated = ({ option }) => {
    if (selectedOptions.length > 0) {
      const optionIsFixed = multi && option.fixed
      const selected = _.find(selectedOptions, selected => selected.value === option.value)
      const hasSelectedParent = _.find(option.ancestors, ancestorOption => _.find(selectedOptions, selected => selected.value === optionFormatterCallback(ancestorOption).value))
      const hasRestrictedParent = _.find(restrictedOptions, restrictedOption => restrictedOption.value === option.value)
      const parentHasSelectedFixedChild = !!_.find(selectedOptions, selected => {
        return selected.fixed && _.find(selected.ancestors, ancestor => optionFormatterCallback(ancestor).value === option.value)
      })
      const clearableBlocked = clearable && selectedOptions.length === 1 && _.head(selectedOptions).value === option.value

      if (optionIsFixed) {
        return {selected: true, disabled: true, blocked: false, restricted: false, fixed: true}
      } else if (hasSelectedParent) {
        return {selected: true, disabled: true, blocked: false, restricted: false, fixed: false}
      } else if (hasRestrictedParent) {
        // disabled: false
        return {selected: true, disabled: parentHasSelectedFixedChild, blocked: false, restricted: true, fixed: false}
      } else if (clearableBlocked) {
        return {selected: true, disabled: true, blocked: !option.hasChildren, restricted: false, fixed: false}
      } else {
        return {selected: !_.isEmpty(selected), disabled: false, blocked: false, restricted: false, fixed: false}
      }
    }
    return {selected: false, disabled: false, restricted: false, fixed: false}
  }
  const dropdownItemDisabled = (element, loading) => {
    const menuTree = element.closest('.dropdown-tree-menu')
    const allMenuTreeItem = menuTree?.querySelectorAll('.dropdown-tree-menu-item')
    const menuTreeItem = element.closest('.dropdown-tree-menu-item')
    const dropdownItemIndex = menuTreeItem.getAttribute('data-index')
    if (loading) {
      _.forEach(allMenuTreeItem, menuTreeItem => {
        const dropdownItem = menuTreeItem.querySelector('.dropdown-item')
        if (menuTreeItem.getAttribute('data-index') !== dropdownItemIndex) {
          dropdownItem.classList.add('disabled')
        }
      })
    } else {
      _.forEach(allMenuTreeItem, menuTreeItem => {
        const dropdownItem = menuTreeItem.querySelector('.dropdown-item')
        dropdownItem.classList.remove('disabled')
      })
    }
  }
  const dropdownItemLoader = (e, show) => {
    const element = e.target.closest('.dropdown-item')
    const hasChildrenSelector = element.querySelector('.has-children')
    const hasChildrenLoaderSelector = element.querySelector('.has-children-loader')

    if (show) {
      hasChildrenSelector?.classList.replace('d-flex', 'd-none')
      hasChildrenLoaderSelector?.classList.replace('d-none', 'd-flex')
      dropdownItemDisabled(element, true)
    } else {
      hasChildrenSelector?.classList.replace('d-none', 'd-flex')
      hasChildrenLoaderSelector?.classList.replace('d-flex', 'd-none')
      dropdownItemDisabled(element, false)
    }
  }
  const clearSelection = () => {
    setClearSelectedOptions(false)
    if (multi) {
      const selectedOptionsFilterd = _.filter(selectedOptions, selectedOption => selectedOption.fixed)
      setSelectedOptions(selectedOptionsFilterd)
      setInitRestrictedOptions(selectedOptionsFilterd)
      onChange({ value: grapValue(selectedOptionsFilterd), options: selectedOptionsFilterd })
    } else {
      setSelectedOptions([])
      setRestrictedOptions([])
      onChange({ value: [], options: [] })
    }
  }
  const clearDropdownTreeState = () => {
    // clear state to force back to init position
    setHeaderTitles([])
    setCurrentOptions(null)
    setPrevOptions([])
  }
  //************************************//
  const onBackClick = (e) => {
    e.preventDefault()
    const removeLastPrevOptions = _.filter(prevOptions, (item, index) => {
      return index.toString() !== _.findLastKey(prevOptions)
    })
    setHeaderTitles((headerTitles) => _.filter(headerTitles, (headerTitle, index) => index.toString() !== _.findLastKey(headerTitles)))
    setCurrentOptions(_.last(prevOptions))
    setPrevOptions(removeLastPrevOptions)
    forceUpdate()
  }
  const onSelectedChange = ({option, checked}) => {
    if (checked) {
      const options = multi ? [...selectedOptions, option] : [option]
      setSelectedOptions(options)
      onChange({ value: grapValue(options), options })
    } else {
      const options = _.filter(selectedOptions, selected => selected.value !== option.value)
      setSelectedOptions(options)
      onChange({ value: grapValue(options), options })
    }
  }
  const onRestrictedChange = ({option, checked}) => {
    if (checked) {
      if (option.ancestors && option.ancestors.length > 0) {
        const ancestors = _.map(option.ancestors, ancestorOption => ({ ...optionFormatterCallback(ancestorOption), access_filter: option.value }))
        if (multi) {
          setRestrictedOptions((restrictedOptions) => ([
            ...restrictedOptions,
            ...ancestors
          ]))
        } else {
          setRestrictedOptions(ancestors)
        }
      } else {
        if (!multi) {
          setRestrictedOptions([])
        }
      }
    } else {
      const restrictedOptionsFiltered = _.filter(restrictedOptions, selected => selected.access_filter !== option.value)
      setRestrictedOptions(restrictedOptionsFiltered)
    }
  }
  const selectedParentOption = ({option}) => {
    onSelectedChange({option, checked: true})
    onRestrictedChange({option, checked: true})
  }
  const unSelectdParentChildOptions = ({option}) => {
    setSelectedOptions((selectedOptions) => _.filter(selectedOptions, (selectedOption) => {
      return _.isEmpty(_.find(selectedOption.ancestors, ancestor => optionFormatterCallback(ancestor).value === option.value))
    }))
    setRestrictedOptions((restrictedOptions) => _.filter(restrictedOptions, (restrictedOption) => {
      return !(restrictedOption.value !== option.value || _.isEmpty(_.find(option.ancestors, ancestor => {
        return optionFormatterCallback(ancestor).value === restrictedOption.value
      })))
    }))
  }
  const onOptionChange = (e, { option, checked, fixed, restricted }) => {
    if (fixed || !option.canSelect) return
    if (restricted) {
      // remove child when parent is selected
      selectedParentOption({option})
      unSelectdParentChildOptions({option})
    } else {
      onSelectedChange({option, checked})
      onRestrictedChange({option, checked})
    }
    // reset clear if thee is no selected items
    if (selectedOptions.length === 0) {
      setClearSelectedOptions(false)
    }
    forceUpdate()
  }
  const onDropdownItemClick = (e, { options, option, checkedObject }) => {
    if (option.hasChildren) {
      const resolveCallback = (data) => {
        setHeaderTitles((headerTitles) => [...headerTitles, option.label])
        setPrevOptions((prevOptions) => [...prevOptions, options])

        if (data.length > 0) {
          setCurrentOptions(_.map(data, option => optionFormatterCallback(option)))
          setMemoOptions((memoOptions) => ({ ...memoOptions, [option.value]: data }))
          loadFixedSelectedOptions(data)
        } else {
          setCurrentOptions([])
          setMemoOptions((memoOptions) => ({ ...memoOptions, [option.value]: [] }))
        }
        forceUpdate()
      }
      if (_.has(memoOptions, option.value)) {
        resolveCallback(_.get(memoOptions, option.value))
      } else {
        dropdownItemLoader(e, true)
        loadOptions({
          parentId: option.value
        }).then(({data}) => {
          dropdownItemLoader(e, false)
          resolveCallback(data)
        })
      }
    } else {
      onOptionChange(e, { option, checked: !checkedObject.selected, fixed: checkedObject.fixed, restricted: checkedObject.restricted })
    }
  }
  let dropdownTreeRequestTimeout = null
  const onSearchChange = (e) => {
    const resolveCallback = (data, status) => {
      clearDropdownTreeState()
      if (data.length > 0) {
        if (!group) {
          const options = _.map(data, option => optionFormatterCallback(option))
          setCurrentOptions(options)
          setMemoOptions((memoOptions) => ({ ...memoOptions, [`q:${e.target.value}`]: data }))
          loadFixedSelectedOptions(data)
        } else {
          const groupOptions = status === 'load' ? groupOptionFormatterCallback(data) : data
          const options = _.map(groupOptions, option => optionFormatterCallback(option))
          setCurrentOptions(options)
          setMemoOptions((memoOptions) => ({ ...memoOptions, [`q:${e.target.value}`]: groupOptions }))
          loadFixedSelectedOptions(groupOptions)
        }
      } else {
        setSearch((state) => ({...state, label: e.target.value}))
        setCurrentOptions([])
        setMemoOptions((memoOptions) => ({ ...memoOptions, [`q:${e.target.value}`]: [] }))
      }
      setSearch((state) => ({...state, loading: false}))
      forceUpdate()
    }
    const loadOptionsCallback = () => {
      setSearch((state) => ({...state, loading: true}))
      const queryObject = e.target.value ? {q: e.target.value} : {}
      loadOptions({
        ...queryObject
      }).then(({data}) => {
        resolveCallback(data, 'load')
      })
    }
    clearTimeout(dropdownTreeRequestTimeout)
    if (_.has(memoOptions, `q:${e.target.value}`)) {
      resolveCallback(_.get(memoOptions, `q:${e.target.value}`), 'memo')
    } else {
      dropdownTreeRequestTimeout = setTimeout(loadOptionsCallback, delaySearch)
    }
  }
  //************************************//
  const buildHeaderOption =  ({ headerTitles }) => {
    return (
      <DropdownItem toggle={false} className="py-0" onClick={onBackClick}>
        <div className="d-flex align-items-center py-50 cursor-pointer">
          <span className="mr-50">
            <ArrowLeft size={16}/>
          </span>
          {_.last(headerTitles)}
        </div>
      </DropdownItem>
    )
  }
  const buildEmptyResult = () => {
    return (
      <div className="dropdown-tree-menu-item">
        {headerTitles?.length > 0 && buildHeaderOption({ headerTitles })}
        <div className="dropdown-item-wrapper">
          <div className="no-data text-center py-50">{trans("dropdownTree.noResults")} {search.label && `${trans('dropdownTree.for')} ${search.label}`}</div>
        </div>
      </div>
    )
  }
  const buildOptions = ({ options, originalOptions, headerRender, isSelectedArea, applyGroup }) => {
    const buildItems = (options, groupLabel = '') => {
      return _.map(options, (option, index) => {
        const checkedObject = checkedEvaluated({ option })
        const DropdownLeafCustomIcon = dropdownLeafCustomIcon
        return (
          <div key={index} className="dropdown-tree-menu-item" data-index={option.value}>
            {index === 0 && (
              <Fragment>
                {
                  headerRender
                    ? headerRender
                    : headerTitles?.length > 0
                    ? buildHeaderOption({ headerTitles })
                    : (
                      <Fragment>
                        {groupLabel && (
                          <DropdownItem header className="py-75">
                            <div className="text-muted text-uppercase">{groupLabel}</div>
                          </DropdownItem>
                        )}
                        {!groupLabel && (
                          <DropdownItem header className="py-0">
                            <div className="py-50">{trans('dropdownTree.all')}</div>
                          </DropdownItem>
                        )}
                      </Fragment>
                    )
                }
              </Fragment>
            )}
            <div className="dropdown-item-wrapper">
              <div className="dropdown-checkbox">
                <InputContainer
                  type="checkbox"
                  id={uuidv4()}
                  name={option.value}
                  value={option.value}
                  className={classNames({ 'has-minus': checkedObject.restricted })}
                  checked={checkedObject.selected || false}
                  disabled={checkedObject.disabled || checkedObject.blocked || !option.canSelect}
                  onChange={(e) => onOptionChange(e, { option, checked: !checkedObject.selected, restricted: checkedObject.restricted })}
                />
              </div>
              <DropdownItem className="d-flex align-items-center" disabled={checkedObject.blocked} onClick={(e) => onDropdownItemClick(e, { options: originalOptions, option, checkedObject })} toggle={false}>
                <div className="dropdown-title text-truncate">
                  <span>{option.label}</span>
                </div>
                {option.hasChildren && (
                  <Fragment>
                    <ChevronRight size={18} className="d-flex has-children text-primary"/>
                    <Spinner type='grow' color='primary' size='sm' className="d-none has-children-loader"/>
                  </Fragment>
                )}
                {showDropdownLeafIcon && !group && !option.hasChildren && <DropdownLeafCustomIcon size={18} className="d-flex text-muted"/>}
              </DropdownItem>
            </div>
          </div>
        )
      })
    }
    const buildGroupItems = (options) => {
      const itemsGroup = _.groupBy(options, (item) => item.groupLabel)
      return _.map(itemsGroup, (options, groupLabel) => buildItems(options, groupLabel))
    }
    return options.length > 0
      ? applyGroup
        ? buildGroupItems(options)
        : buildItems(options)
      : buildEmptyResult()
  }
  const buildSearch = () => {
    return (
      <div className="p-1">
        <InputGroup className='input-group-merge'>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              {search.loading && <Spinner size="sm"/>}
              {!search.loading && <Search size={14} />}
            </InputGroupText>
          </InputGroupAddon>
          <InputContainer type="uncontrolled-text" placeholder="Search" className="form-control" onChange={onSearchChange}/>
        </InputGroup>
      </div>
    )
  }
  const buildSelectedOptions = ({ options, originalOptions }) => {
    const headerRender = (
      <DropdownItem header className="py-0">
        <div className="d-flex justify-content-between align-items-center py-50">
          <div>{trans('dropdownTree.selected')}</div>
          {!clearable && multi && (
            <div>
              {!clearSelectedOptions && <Button.Ripple size="sm" color='flat-primary' className="px-50 py-25" onClick={() => setClearSelectedOptions(true)}>{trans('dropdownTree.clearSelection')}</Button.Ripple>}
              {clearSelectedOptions && <Button.Ripple size="sm" color='flat-secondary' className="px-50 py-25" onClick={() => setClearSelectedOptions(false)}>{trans('dropdownTree.cancel')}</Button.Ripple>}
              {clearSelectedOptions && <Button.Ripple size="sm" color='flat-danger' className="px-50 py-25" onClick={() => clearSelection()}>{trans('dropdownTree.confirm')}</Button.Ripple>}
            </div>
          )}
        </div>
      </DropdownItem>
    )
    return (
      <Fragment>
        {buildOptions({ options, originalOptions, headerRender, isSelectedArea: true, applyGroup: false })}
        <hr className="mx-1"/>
      </Fragment>
    )
  }
  //************************************//
  useEffect(() => {
    if (open && options.length === 0) {
      setOptionsLoading(true)
      loadOptions().then(({data}) => {
        setOptionsLoading(false)
        if (!group) {
          const options = _.map(data, option => optionFormatterCallback(option))
          setOptions(options.length > 0 ? options : true)
          setMemoOptions((memoOptions) => ({ ...memoOptions, ['q:']: data }))
          loadFixedSelectedOptions(data)
        } else {
          const groupOptions = groupOptionFormatterCallback(data)
          const options = _.map(groupOptions, option => optionFormatterCallback(option))
          setOptions(options.length > 0 ? options : true)
          setMemoOptions((memoOptions) => ({ ...memoOptions, ['q:']: groupOptions }))
          loadFixedSelectedOptions(groupOptions)
        }
        forceUpdate()
      }).catch(() => {
        setOptionsLoading(false)
      })
    }
  }, [open])

  useEffect(() => clearDropdownTreeState(), [!open])

  useEffect(() => {
    if (selectedOptions.length > 0 && value && value.length === 0) {
      clearSelection()
    }
    if (selectedOptions.length === 0 && value && value.length > 0) {
      const ids = _.map(value, item => (typeof item === 'object' ? item.value : item))
      loadOptions({
        ids
      }).then(({data}) => {
        if (!group) {
          const dataFormatted = _.map(data, option => optionFormatterCallback(option))
          setSelectedOptions(dataFormatted)
          setInitRestrictedOptions(dataFormatted)
        } else {
          const groupOptions = groupOptionFormatterCallback(data)
          const dataFormatted = _.map(groupOptions, option => optionFormatterCallback(option))
          setSelectedOptions(dataFormatted)
          setInitRestrictedOptions(dataFormatted)
        }
      })
    }
  }, [value])
  //************************************//
  return (
    <div className={classNames("dropdown-tree", className)}>
      <Dropdown isOpen={open} toggle={() => setOpen((open) => !open)} direction={dropdownDirection}>
        <DropdownToggle
          data-toggle="dropdown"
          className={classNames('dropdown-tree-toggle form-control px-1 pr-75', dropdownClassName)}
          tag="div"
        >
          <span className="value">
            <span className="text-truncate">{selectedOptionsLabels.join(', ') || trans('gen.reactSelect.placeholder')}</span>
            {selectedOptionsLabels.length > 0 && <span className="mr-50 text-muted">({selectedOptionsLabels.length})</span>}
          </span>
          <span className="icon">
            <ChevronDown size={18}/>
          </span>
        </DropdownToggle>
        <DropdownMenu ref={dropdownMenuRef} flip={dropdownMenuFlip} className="dropdown-tree-menu">
          {buildSearch()}
          <div className="dropdown-tree-menu-scroll" style={{ maxHeight: dropdownMenuHeight }}>
            {selectedOptions.length > 0 && prevOptions.length === 0 && buildSelectedOptions({ options: selectedOptions, originalOptions: options })}
            <LoadingIndicator loading={optionsLoading}>
              {!currentOptions && buildOptions({ options, originalOptions: options, isSelectedArea: false, applyGroup: group })}
              {currentOptions && buildOptions({ options: currentOptions, originalOptions: currentOptions, isSelectedArea: false, applyGroup: group })}
            </LoadingIndicator>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
//************************************//
UncontrolledDropdownTree.defaultProps = {
  value: [],
  loadOptions: (q = '', parentId = '', ids = []) => {},
  delaySearch: 500,
  optionFormatter: (option) => {
    return {
      groupCode: option.groupCode,
      groupLabel: option.groupLabel,
      value: option.value,
      label: option.label,
      hasChildren: option.children?.length > 0,
      ancestors: option.ancestors,
      fixed: option.fixed,
      canSelect: true
    }
  },
  onChange: ({ value, options }) => {},
  dropdownOptions: {
    dropdownDirection: 'down',
    dropdownClassName: '',
    dropdownMenuFlip: true,
    dropdownMenuHeight: '250px',
    showDropdownLeafIcon: true,
    dropdownLeafCustomIcon: null
  },
  multi: true,
  group: false,
  clearable: false,
  groupOptionFormat: null
}
//************************************//
UncontrolledDropdownTree.propTypes = {
  value: Proptypes.oneOfType([
    Proptypes.arrayOf(Proptypes.any),
    Proptypes.arrayOf(
      Proptypes.shape({
        value: Proptypes.any
      })
    )
  ]),
  loadOptions: Proptypes.func,
  delaySearch: Proptypes.number,
  optionFormatter: Proptypes.func,
  onChange: Proptypes.func,
  dropdownOptions: Proptypes.shape({
    dropdownDirection: Proptypes.oneOf(['up', 'down']),
    dropdownClassName: Proptypes.string,
    dropdownMenuFlip: Proptypes.bool,
    dropdownMenuHeight: Proptypes.string,
    showDropdownLeafIcon: Proptypes.bool,
    dropdownLeafCustomIcon: Proptypes.any
  }),
  multi: Proptypes.bool,
  group: Proptypes.bool,
  clearable: Proptypes.bool,
  groupOptionFormat: Proptypes.objectOf(
    Proptypes.shape({
      optionsMap: Proptypes.shape({
        value: Proptypes.string,
        label: Proptypes.string,
        fixed: Proptypes.string
      }),
      groupCode: Proptypes.string
    })
  )
}
//************************************//
export default UncontrolledDropdownTree
