import moment from "moment"
import {isMacOs, isMobile} from "react-device-detect"
import {plans} from "../assets/data/constants/plans"
import {store} from "../redux/storeConfig/store"
import _ from "lodash"
import {API} from "@utils"
//************************************//
export const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}
//************************************//
export const getDuration = ({ fromDate, toDate }) => {
  fromDate =  moment.utc(fromDate)
  toDate = toDate ? moment.utc(toDate) : moment.utc(Date.now())
  const out = moment.duration(fromDate.diff(toDate)).humanize(true)
  return out
}
//************************************//
export const replaceArrayOfStrings = (str, find, replace) => {
  let replaceString = str
  for (let i = 0; i < find.length; i++) {
    replaceString = replaceString.replaceAll(find[i], replace[i])
  }
  return replaceString
}
//************************************//
export const keyboardSymbol = (keys = '', splitKey = '|') => {
  if (isMobile) {
    return ''
  }

  keys = keys.toLowerCase()

  const baseFormats = {
    capslock: '⇪',
    shift: '⇧',
    up: '↑',
    right: '→',
    down: '↓',
    left: '←',
    enter: '↩',
    backspace: '⌫',
    delete: '⌦',
    escape: '⎋',
    tab: '⇥',
    pageup: '⇞',
    pagedown: '⇟',
    space: '␣'
  }

  const macFormats = {
    control: '⌃',
    ctrl: '⌃',
    alt: '⌥',
    option: '⌥',
    meta: '⌘',
    super: '⌘',
    cmd: '⌘',
    command: '⌘'
  }

  const winFormats = {
    control: 'ctrl',
    ctrl: 'ctrl',
    option: 'alt',
    alt: 'alt',
    meta: '❖',
    super: '❖',
    cmd: '❖',
    command: '❖'
  }

  const formats = isMacOs
    ? { ...baseFormats, ...macFormats }
    : { ...baseFormats, ...winFormats }

    return _.chain(keys)
      .split(splitKey)
      .map(x => (formats[x] ? formats[x] : x))
      .join('')
      .toUpper()
      .value()
}

export const getFeatures = () => {
  const {features} = require('../assets/data/constants/features')
  return features
}

export const checkFeatureAvailability = (featureKey) => {
  const plan = _.get(store.getState(), 'app.plan', 'free')

  const feature = _.get(getFeatures(), featureKey, null)

  const planIndex = _.indexOf(plans, plan)

  const featureMinPlanIndex = _.indexOf(plans, _.get(feature, 'plan'))

  return _.isEmpty(feature) || (planIndex >= featureMinPlanIndex)
}

function convertToTelerikFilter(filterObject) {
  const filters = []

  // Loop through the filter object
  for (const [key, value] of Object.entries(filterObject)) {
    // Default operator is 'eq' (equals)
    const filterString = `${key}~eq~'${value}'`
    filters.push(filterString)
  }

  // Join multiple filters with '~and~' if needed
  return `${filters.join('~and~')}`
}

export function _getDatatable(uri, {limit, page, sort, filter}, callback) {
  API.get(uri, {
    params: {
      pageSize: limit,
      page,
      sort,
      filter: convertToTelerikFilter(filter)
    }
  })
    .then(function (res) {
      callback({
        list: res.data,
        pagination: {
          total: res.total,
          current_page: page,
          limit,
          total_pages: Math.ceil(res.total / limit)
        }
      })
    })
    .catch(function (res) {})
}
