import React, {useState, useEffect} from 'react'
import {Row, Col, UncontrolledCollapse, InputGroup, InputGroupAddon, InputGroupText, Table, Alert} from 'reactstrap'
import rrule, {RRule, rrulestr, Frequency, ByWeekday} from "rrule"
import classnames from "classnames"
import moment from "moment"
import _ from "lodash"
import Proptypes from "prop-types"
//************************************//
import CustomFormGroup from "@src/components/helpers/CustomFormGroup"
import InputContainer from "@src/components/helpers/InputContainer"
import {getTextKeys} from './lang'
import {trans} from '@utils'
//************************************//
import {DateTime, UncontrolledDateTime} from "../date-time"
import UncontrolledButtonGroup from "../button-group/UncontrolledButtonGroup"
//************************************//
const UncontrolledRRuleGenerator = ({ value, validator, onChange, ...rest }) => {
  const frequencyOptions = [
    { label: trans('rrule.daily'), code: RRule.DAILY, duration: "P1D", value: 'daily', repeatEvery: trans('rrule.days'), format: 'h:mm A'},
    { label: trans('rrule.weekDay'), code: RRule.WEEKLY, duration: "P1D", value: 'week-day', repeatEvery: trans('rrule.weekDays'), format: 'h:mm A'},
    { label: trans('rrule.weekly'), code: RRule.WEEKLY, duration: "P7D", value: 'weekly', repeatEvery: trans('rrule.weeks'), format: 'dddd, h:mm A'},
    { label: trans('rrule.monthly'), code: RRule.MONTHLY, duration: "P1M", value: 'monthly', repeatEvery: trans('rrule.months'), format: 'D MMM YYYY h:mm A'},
    { label: trans('rrule.yearly'), code: RRule.YEARLY, duration: "P1Y", value: 'yearly', repeatEvery: trans('rrule.years'), format: 'D MMM YYYY h:mm A'}
  ]
  const recurrenceEndTypeOptions = [
    { label: trans('rrule.recurrence_end.forever'), value: 'forever'},
    { label: trans('rrule.recurrence_end.until'), value: 'until'},
    { label: trans('rrule.recurrence_end.count'), value: 'count'}
  ]
  const bySetPosOptions = [
    { label: trans('rrule.first'), value: 1},
    { label: trans('rrule.second'), value: 2},
    { label: trans('rrule.third'), value: 3},
    { label: trans('rrule.fourth'), value: 4},
    { label: trans('rrule.last'), value: -1}
  ]
  //************************************//
  const rruleOptionsStringToObject = value ? rrulestr(value?.recurrence) : {}
  const rruleOptionsValue = _.get(rruleOptionsStringToObject, 'origOptions')
  //************************************//
  const [rruleOptions, setRRuleOptions] = useState({})
  const [valueObject, setValueObject] = useState({})
  //************************************//
  const weekdays = (sliceLabel = false) => {
    const days = [...moment.weekdays()]
    days.push(days.shift())
    const daysLocalEn = [...moment.localeData('en').weekdays()]
    daysLocalEn.push(daysLocalEn.shift())
    return _.map(days, (day, index) => ({ label: sliceLabel ? day.slice(0, 2) : day, value: RRule[daysLocalEn[index].slice(0, 2).toUpperCase()].weekday }))
  }
  const months = () => {
    const months = moment.months()
    return _.map(months, (month, index) => ({ label: month.slice(0, 3), value: index + 1 }))
  }
  const weekdaysArray = weekdays(true)
  const byDayOptions = weekdays()
  const monthsArray = months()
  const currentMonth = parseInt(moment().format('M'))
  //************************************//
  const selectedWeekDay = _.map(rruleOptions.byweekday, weekdayId => _.find(weekdaysArray, weekday => weekday.value === weekdayId)?.value)
  const selectedMonths = _.map(rruleOptions.bymonth, monthId => _.find(monthsArray, month => month.value === monthId))
  const selectedFrequencyOption = _.find(frequencyOptions, option => option.value === rruleOptions.frequencySelected)
  const selectedEndType = _.find(recurrenceEndTypeOptions, option => option.value === rruleOptions.endType)
  const selectedBySetPos = _.find(bySetPosOptions, step => step.value === rruleOptions.bysetpos)
  const selectedByDay = _.find(byDayOptions, day => day.value === _.first(rruleOptions.byday))
  const recurrenceEndTypeOptionsFiltered = _.filter(recurrenceEndTypeOptions, option => !(option.value === 'forever' && validator.endDate))
  const startMustLabeled = _.includes(['daily', 'week-day', 'weekly'], rruleOptions.frequencySelected)
  //************************************//
  const getFrequencyOption = (value = 'daily') => _.find(frequencyOptions, frequencyOption => frequencyOption.value === value)
  const duration = (startDate, endDate) => {
    if (startDate && endDate) {
      const frequencyDuration = selectedFrequencyOption.duration
      const now = moment(startDate)
      const end = moment(endDate)
      if (now.isAfter(end)) {
        const endDateDuration = now.add(frequencyDuration)
        const duration = moment.duration(endDateDuration.diff(now))
        if (duration.isValid()) return duration.toString()
      } else {
        const duration = moment.duration(end.diff(now))
        if (duration.isValid()) return duration.toString()
      }
    }
    return ""
  }
  const displayExtraFormatEndedAt = () => {
    if (['daily', 'week-day'].includes(selectedFrequencyOption?.value)) {
      const startDateDay = moment(rruleOptions.started_at).format('DD')
      const endDateDay = moment(rruleOptions.ended_at).format('DD')
      if (startDateDay !== endDateDay) {
        return trans('rrule.next')
      }
    }
    return ''
  }
  const evaluateEndAtDuration = () => {
    // check if start datetime bigger than end dateTime
    if (rruleOptions.started_at) {
      const duration = selectedFrequencyOption.duration
      const rruleStartAt = rruleOptions.started_at
      const rruleEndAt = rruleOptions.ended_at
      const endedAtDuration = moment(rruleOptions.started_at).add(duration)
      let rruleEndAtResult = null

      if (rruleEndAt && moment(rruleStartAt).isAfter(rruleEndAt)) {
        rruleEndAtResult = endedAtDuration.toISOString()
      }

      if (rruleEndAt && moment(endedAtDuration.toISOString()).isBefore(rruleEndAt)) {
        rruleEndAtResult = endedAtDuration.toISOString()
      }

      if (!rruleEndAt) {
        rruleEndAtResult = endedAtDuration.toISOString()
      }

      if (rruleEndAtResult) {
        setRRuleOptions(state => ({...state, ended_at: rruleEndAtResult}))
      }

      return rruleEndAtResult || rruleEndAt
    }
  }
  //************************************//
  useEffect(() => {
    if (value) {
      const defaultWkst = RRule['MO'].weekday
      const startedAt = moment(rruleOptionsValue.dtstart).toISOString()
      const endedAt = moment(rruleOptionsValue.dtstart).add(value.duration).toISOString()
      const wkst = rruleOptionsValue.wkst?.weekday || defaultWkst
      const bymonth = rruleOptionsValue.bymonth ? [rruleOptionsValue.bymonth] : [currentMonth]
      const bymonthday = rruleOptionsValue.bymonthday || null
      const byweekday = _.map(rruleOptionsValue.byweekday, item => item.weekday)
      const byday = byweekday.length > 0 ? byweekday : [RRule.MO.weekday]
      const count = rruleOptionsValue.count || 1
      const interval = rruleOptionsValue.interval || 1
      const bysetpos = rruleOptionsValue.bysetpos || 1
      const until = rruleOptionsValue.until ? moment(rruleOptionsValue.until).toISOString() : (validator.endDate || endedAt)
      const endType = (rruleOptionsValue.count > 0 ? 'count' : rruleOptionsValue.until ? 'until' : 'forever') || null
      const repeatOnOption = bymonthday > 0 ? 'bymonthday' : 'bySetPosAndByDay'
      const duration = value.duration
      const frequencySelected = (freq) => {
        switch (freq) {
          case RRule.DAILY: { return 'daily' }; break
          case RRule.WEEKLY: {
            return byweekday.length > 0 ? 'week-day' : 'weekly'
          }; break
          case RRule.MONTHLY: { return 'monthly' }; break
          case RRule.YEARLY: { return 'yearly' }; break
        }
      }
      setRRuleOptions({
        frequency: rruleOptionsValue.freq,
        frequencySelected: frequencySelected(rruleOptionsValue.freq),
        started_at: startedAt,
        ended_at: endedAt,
        until,
        interval,
        wkst,
        count,
        byweekday,
        bymonth,
        bymonthday,
        savedbymonthday: bymonthday || 1,
        bysetpos,
        byday,
        repeatOnOption,
        duration,
        endType
      })
    } else {
      const object = getFrequencyOption()
      const endType = _.first(recurrenceEndTypeOptionsFiltered)
      const started_at = moment(validator.startDate).isAfter(moment())
        ? moment(validator.startDate).toISOString()
        : moment().toISOString()
      const ended_at = moment(validator.startDate).isAfter(moment())
        ? moment(validator.startDate).add(object.duration).toISOString()
        : moment().add(object.duration).toISOString()

      setRRuleOptions({
        frequency: Frequency.DAILY,
        frequencySelected: 'daily',
        started_at,
        ended_at,
        until: validator.endDate || ended_at,
        interval: 1,
        wkst: RRule['MO'].weekday,
        count: 1,
        byweekday: [],
        bymonth: [currentMonth],
        bymonthday: 1,
        savedbymonthday: 1,
        bysetpos: 1,
        byday: [RRule.MO.weekday],
        repeatOnOption: 'bymonthday',
        duration: object.duration,
        endType: endType.value
      })
    }
  }, [])
  useEffect(() => {
    const object = {}
    const ended_at = evaluateEndAtDuration()
    const durationValue = duration(rruleOptions.started_at, ended_at)
    if (rruleOptions.started_at) {
      const startedAt = moment(rruleOptions.started_at).utc(false)
      object.dtstart = new Date(Date.UTC(startedAt.year(), startedAt.month(), startedAt.date(), startedAt.hours(), startedAt.minutes(), startedAt.seconds()))
    }
    if (rruleOptions.frequency !== undefined) object.freq = rruleOptions.frequency
    if (rruleOptions.interval) object.interval = rruleOptions.interval
    if (rruleOptions.wkst > 0) object.wkst = rruleOptions.wkst
    if (rruleOptions.endType === 'count' && rruleOptions.count) object.count = rruleOptions.count
    if (rruleOptions.endType === 'until' && rruleOptions.until) {
      const until = moment(rruleOptions.until).utc(false)
      object.until = new Date(Date.UTC(until.year(), until.month(), until.date(), until.hours(), until.minutes(), until.seconds()))
    }
    if (rruleOptions.frequencySelected === 'week-day' && rruleOptions.byweekday?.length > 0) object.byweekday = rruleOptions.byweekday
    if (_.includes([RRule.YEARLY], rruleOptions.frequency) && rruleOptions.bymonth?.length > 0) object.bymonth = rruleOptions.bymonth
    if (_.includes([RRule.YEARLY, RRule.MONTHLY], rruleOptions.frequency) && rruleOptions.repeatOnOption === 'bymonthday' && rruleOptions.bymonthday >= 1) object.bymonthday = rruleOptions.bymonthday
    if (_.includes([RRule.YEARLY, RRule.MONTHLY], rruleOptions.frequency) && rruleOptions.repeatOnOption === 'bySetPosAndByDay' && rruleOptions.bysetpos) object.bysetpos = rruleOptions.bysetpos
    if (_.includes([RRule.YEARLY, RRule.MONTHLY], rruleOptions.frequency) && rruleOptions.repeatOnOption === 'bySetPosAndByDay' && rruleOptions.byday) object.byweekday = rruleOptions.byday
    const rruleObject = new RRule(object)

    let rowsCount = 0
    let data = []
    const dataResult = rruleObject.all((date, length) => {
      const selectedDate = moment(date).add(1, 'day')
      const dateNow = moment()

      if (selectedDate.isAfter(dateNow)) {
        rowsCount = rowsCount + 1
        data = [...data, date]
      }

      return rowsCount < 100
    })

    const valueObject = {
      recurrenceObject: object,
      recurrence: rruleObject.toString(),
      text: rruleObject.toText(
        (id) => (getTextKeys[id] || id),
        {
          dayNames: moment.weekdays(),
          monthNames: moment.months()
        }
      ),
      duration: durationValue,
      data
    }
    setValueObject(valueObject)
    if (onChange) onChange(valueObject)
  }, [rruleOptions])
  useEffect(() => {
    if (validator.startDate && rruleOptions.started_at) {
      const validatorStartDate = validator.startDate
      const rruleStartAt = rruleOptions.started_at
      const check = moment(validatorStartDate).isAfter(rruleStartAt)
      if (check) {
        setRRuleOptions(state => ({...state, started_at: null, ended_at: null}))
      }
    }
  }, [validator.startDate])
  useEffect(() => {
    const extraState = {}
    const validatorEndDate = validator.endDate

    // change endType when validator change
    if (validator.endDate) {
      const endType = rruleOptionsValue?.count > 0 ? 'count' : 'until'
      if (endType === 'until' && !rruleOptions.ended_at) {
        extraState.until = validatorEndDate
      }
      setRRuleOptions(state => ({...state, endType, ...extraState }))
    }
    // clear until when it's bigger than validator endDate
    if (validator.endDate && rruleOptions.until) {
      const rruleUntil = rruleOptions.until
      const check = moment(validatorEndDate).isBefore(rruleUntil)
      if (check) {
        setRRuleOptions(state => ({...state, until: validatorEndDate}))
      }
    }
  }, [validator.endDate])
  useEffect(() => {
    if (rruleOptions.frequencySelected) {
      const object = getFrequencyOption(rruleOptions.frequencySelected)
      setRRuleOptions((state) => ({
        ...state,
        duration: object.duration
      }))
    }
  }, [rruleOptions.frequencySelected])
  //************************************//
  return (
     <div className="rrule-generator">
       <h5 className="mb-1">{rest.header || trans('rrule.recurrence')}</h5>

       {rest.error && (
         <Alert color='danger'>
           <div className='alert-body'>
             {valueObject.data?.length === 0 && <div>{trans('rrule.validation.data', { data: valueObject.data?.length })}</div>}
             {valueObject.duration === '' && <div className="mt-25">{trans('rrule.validation.duration')}</div>}
           </div>
         </Alert>
       )}

       {/*Recurrence frequency*/}
       <Row>
         <Col>
           <CustomFormGroup title={trans('rrule.frequency')}>
             <InputContainer
               type={'uncontrolled-select'}
               name={`rrule.frequency`}
               className='react-select'
               classNamePrefix='select'
               options={frequencyOptions}
               value={selectedFrequencyOption}
               onChange={(option) => {
                 const endedAtDuration = moment(rruleOptions.started_at).add(option.duration)
                 setRRuleOptions(state => ({...state, frequency: option.code, frequencySelected: option.value, ended_at: endedAtDuration.toISOString()}))
               }}
             />
           </CustomFormGroup>
         </Col>
         <Col>
           <CustomFormGroup title={trans('rrule.repeatEvery')}>
             <InputGroup>
               <InputContainer
                 type="uncontrolled-number"
                 value={rruleOptions.interval || ''}
                 min={1}
                 onChange={(e) => {
                   setRRuleOptions(state => ({...state, interval: parseInt(e.target.value)}))
                 }}
               />
               <InputGroupAddon addonType='append'>
                 <InputGroupText className="bg-light">
                   {selectedFrequencyOption?.repeatEvery}
                 </InputGroupText>
               </InputGroupAddon>
             </InputGroup>
           </CustomFormGroup>
         </Col>
       </Row>

       {/*Recurrence start at - end at*/}
       <Row>
         <Col lg={6}>
           <div className="recurrence-started-at">
             <CustomFormGroup title={trans('rrule.start')}>
                <UncontrolledDateTime
                 name='rrule.started_at'
                 value={rruleOptions.started_at}
                 format={'LLL'}
                 displayFormat={selectedFrequencyOption?.format}
                 minDate={validator.startDate ? moment(validator.startDate).toISOString(true) : null}
                 enableTime={true}
                 onChange={(value) => {
                   setRRuleOptions(state => ({...state, started_at: value}))
                 }}
               />
               {startMustLabeled && <span className="font-small-2">{trans('rrule.startDateDurationMessage', { date: moment(rruleOptions.started_at).format('DD MMM Y')})}</span>}
             </CustomFormGroup>
             <span className={classnames("symbol d-lg-flex d-none font-medium-4", {"my-1": !startMustLabeled, "my-25": startMustLabeled})}>~</span>
           </div>
         </Col>
         <Col lg={6}>
           <CustomFormGroup className="mt-0 mt-lg-2">
             <UncontrolledDateTime
               name='rrule.ended_at'
               value={rruleOptions.ended_at}
               format={'LLL'}
               startWithDisplayFormat={displayExtraFormatEndedAt()}
               displayFormat={selectedFrequencyOption?.format}
               minDate={moment(rruleOptions.started_at).toISOString(true)}
               maxDate={moment(rruleOptions.started_at).add(rruleOptions.duration).toISOString(true)}
               enableTime={true}
               onChange={(value) => {
                 setRRuleOptions(state => ({...state, ended_at: value}))
               }}
             />
           </CustomFormGroup>
         </Col>
       </Row>

       <Row>
         <Col lg={12}>
           {/*repeatOnDay*/}
           {/*todo: this will be with week day*/}
           <Row className={classnames('d-none', { 'd-block': selectedFrequencyOption?.value === 'week-day' })}>
             <Col>
               <CustomFormGroup title={trans('rrule.repeatOn')}>
                 <UncontrolledButtonGroup
                   value={selectedWeekDay}
                   options={weekdaysArray}
                   isCircle={true}
                   isSplit={true}
                   isMulti={true}
                   onChange={(options) => {
                     setRRuleOptions(state => ({...state, byweekday: options}))
                   }}
                 />
               </CustomFormGroup>
             </Col>
           </Row>

           {/*repeatOnMonth*/}
           <Row className={classnames('d-none', { 'd-block': selectedFrequencyOption?.value === 'yearly' })}>
             <Col lg={6}>
               <CustomFormGroup title={trans('rrule.repeatOn')}>
                 <InputContainer
                   type={'uncontrolled-select'}
                   name={`rrule.bymonth`}
                   className='react-select'
                   classNamePrefix='select'
                   options={monthsArray}
                   value={_.head(selectedMonths)}
                   onChange={(option) => {
                     setRRuleOptions(state => ({...state, bymonth: [option.value]}))
                   }}
                 />
               </CustomFormGroup>
             </Col>
           </Row>

           {/*repeatOn*/}
           <Row className={classnames('d-none', { 'd-block': _.includes(['yearly', 'monthly'], selectedFrequencyOption?.value) })}>
             <Col lg={6}>
               <CustomFormGroup title={selectedFrequencyOption?.value !== 'yearly' && trans('rrule.repeatOn')}>
                 <div className="d-flex align-items-center mb-1">
                   <InputContainer
                     type="radio"
                     id={'rrule.repeatOn.bymonthday'}
                     name={'options.rrule.repeatOnOption'}
                     value={'bymonthday'}
                     checked={rruleOptions.repeatOnOption === 'bymonthday'}
                     onChange={(e) => {
                       setRRuleOptions(state => ({...state, repeatOnOption: e.target.value, bymonthday: state.savedbymonthday}))
                     }}
                   />
                   <InputGroup>
                     <InputContainer
                       type="uncontrolled-number"
                       value={rruleOptions.bymonthday || ''}
                       placeholder={rruleOptions.savedbymonthday || ''}
                       min={1}
                       max={31}
                       onFocus={(e) => {
                         setRRuleOptions(state => ({...state, bymonthday: state.savedbymonthday}))
                       }}
                       onBlur={(e) => {
                         if (rruleOptions.repeatOnOption !== 'bymonthday') {
                           setRRuleOptions(state => ({...state, bymonthday: null}))
                         }
                       }}
                       onChange={(e) => {
                         const targetValue = e.target.value === '' ? 1 : e.target.value
                         const value = parseInt(targetValue)
                         const bymonthday  = value > 31 ? 31 : value
                         setRRuleOptions(state => ({...state, bymonthday, savedbymonthday: bymonthday, repeatOnOption: 'bymonthday'}))
                       }}
                     />
                     <InputGroupAddon addonType='append'>
                       <InputGroupText className="bg-light">
                         {trans('rrule.day')}
                       </InputGroupText>
                     </InputGroupAddon>
                   </InputGroup>
                 </div>
                 <div className="d-flex align-items-center mb-1">
                   <InputContainer
                     type="radio"
                     id={'rrule.repeatOn.bySetPosAndByDay'}
                     name={'options.rrule.repeatOnOption'}
                     value={'bySetPosAndByDay'}
                     checked={rruleOptions.repeatOnOption === 'bySetPosAndByDay'}
                     onChange={(e) => {
                       setRRuleOptions(state => ({...state, repeatOnOption: e.target.value, bymonthday: null}))
                     }}
                   />
                   <InputContainer
                     type={'uncontrolled-select'}
                     name={`rrule.bysetpos`}
                     className='react-select flex-1 mr-lg-75 mr-75'
                     classNamePrefix='select'
                     options={bySetPosOptions}
                     value={selectedBySetPos}
                     onChange={(option) => {
                       setRRuleOptions(state => ({...state, bysetpos: parseInt(option.value), bymonthday: null, repeatOnOption: 'bySetPosAndByDay'}))
                     }}
                   />
                   <InputContainer
                     type={'uncontrolled-select'}
                     name={`rrule.byday`}
                     className='react-select flex-1'
                     classNamePrefix='select'
                     options={byDayOptions}
                     value={selectedByDay}
                     onChange={(option) => {
                        setRRuleOptions(state => ({...state, byday: [option.value], bymonthday: null, repeatOnOption: 'bySetPosAndByDay'}))
                     }}
                   />
                 </div>
               </CustomFormGroup>
             </Col>
           </Row>
         </Col>
       </Row>

       <Row>
         <Col lg={6}>
           <Row className="px-50">
             <Col className="px-50">
               <CustomFormGroup title={`${trans('rrule.end')}`}>
                 <InputContainer
                   type={'uncontrolled-select'}
                   name={`rrule.endType`}
                   className='react-select'
                   classNamePrefix='select'
                   options={recurrenceEndTypeOptionsFiltered}
                   value={selectedEndType}
                   onChange={(option) => {
                     setRRuleOptions(state => ({...state, endType: option.value}))
                   }}
                 />
               </CustomFormGroup>
             </Col>
             <Col className="px-50">
               <CustomFormGroup className={classnames("d-none mt-2", { "d-block": selectedEndType?.value === 'count' })}>
                 <InputContainer
                   type="uncontrolled-number"
                   value={rruleOptions.count || ''}
                   min={0}
                   onChange={(e) => {
                     setRRuleOptions(state => ({...state, count: parseInt(e.target.value)}))
                   }}
                 />
               </CustomFormGroup>
               <CustomFormGroup className={classnames("d-none mt-2", { "d-block": selectedEndType?.value === 'until' })}>
                 <UncontrolledDateTime
                   name='rrule.until'
                   value={rruleOptions.until}
                   minDate={validator.startDate ? moment(validator.startDate).toISOString(true) : null}
                   maxDate={validator.endDate ? moment(validator.endDate).toISOString(true) : null}
                   enableTime={false}
                   onChange={(value) => {
                     setRRuleOptions(state => ({...state, until: value}))
                   }}
                 />
               </CustomFormGroup>
             </Col>
           </Row>
         </Col>
       </Row>

       {/*ruleTitle with table*/}
       <Row>
         <Col lg={12}>
           <CustomFormGroup>
             <a id="rrule-table" className="cursor-pointer d-flex pb-1">
               <u className="cursor-pointer">
                 <span>{valueObject.text}</span>
                 <span className="text-muted ml-25">({valueObject.data?.length === 100 ? `+${valueObject.data?.length}` : valueObject.data?.length})</span>
               </u>
             </a>
             <UncontrolledCollapse toggler="#rrule-table">
               <Row>
                 <Col>
                   <div style={{ maxHeight: 300, overflowY: "auto" }}>
                     <Table responsive striped={true} bordered={true} size='sm'>
                       <tbody>
                       {_.map(valueObject.data, (date, key) => {
                         return (
                           <tr key={key} className="text-center">
                             <td className="text-left" style={{ width: "0%" }}>{key + 1}</td>
                             <td className="text-left" style={{ width: '20%' }}>{ moment(date).format('ddd,')}</td>
                             <td className="text-left" style={{ width: '20%' }}>{ moment(date).format('DD')}</td>
                             <td style={{ width: '20%' }}>{moment(date).format('MMM')}</td>
                             <td style={{ width: '20%' }}>{moment(date).format('Y')}</td>
                             <td style={{ width: '20%' }}>{moment(date).format('hh a')}</td>
                           </tr>
                         )
                       })}
                       </tbody>
                     </Table>
                   </div>
                 </Col>
               </Row>
             </UncontrolledCollapse>
           </CustomFormGroup>
         </Col>
       </Row>

       {/*advanced*/}
       <Row className="d-none">
         <Col>
           <h6 id="advanced" className="m-0 pb-50 cursor-pointer">{trans('rrule.advanced')}</h6>
           <hr className="mt-0 mb-25 mb-75"/>
           <UncontrolledCollapse toggler="#advanced">
             {/*startAtDay*/}
             <Row>
               <Col>
                 <CustomFormGroup title={trans('rrule.startAtDay')}>
                   <UncontrolledButtonGroup
                     value={rruleOptions.wkst}
                     options={weekdaysArray}
                     onChange={(value) => {
                       setRRuleOptions(state => ({...state, wkst: value}))
                     }}
                   />
                 </CustomFormGroup>
               </Col>
             </Row>
           </UncontrolledCollapse>
         </Col>
       </Row>

       {/*Dev*/}
       {rest.dev && <Row>
         <Col>
           <h6 id="dev" className="m-0 pb-50 cursor-pointer">Dev</h6>
           <hr className="mt-0 mb-25 mb-75"/>
           <UncontrolledCollapse toggler="#dev">
             {/*rruleOptions*/}
             <Row>
               <Col>
                 <CustomFormGroup title={'rruleOptions'}>
               <pre>
                   {JSON.stringify(rruleOptions, null, 2) }
               </pre>
                 </CustomFormGroup>
               </Col>
             </Row>

             {/*valueObject*/}
             <Row>
               <Col>
                 <CustomFormGroup title={'valueObject'}>
               <pre>
                   {JSON.stringify(valueObject, null, 2) }
               </pre>
                 </CustomFormGroup>
               </Col>
             </Row>
           </UncontrolledCollapse>
         </Col>
       </Row>}
     </div>
  )
}
//************************************//
UncontrolledRRuleGenerator.defaultProps = {
  value: null,
  header: '',
  validator: {},
  dev: false,
  onChange: (value) => {}
}
//************************************//
UncontrolledRRuleGenerator.propTypes = {
  value: Proptypes.shape({
    recurrence: Proptypes.string,
    duration: Proptypes.string
  }),
  header: Proptypes.string,
  validator: Proptypes.shape({
    startDate: Proptypes.any,
    endDate: Proptypes.any
  }),
  dev: Proptypes.bool,
  onChange: Proptypes.func
}
//************************************//
export default UncontrolledRRuleGenerator
