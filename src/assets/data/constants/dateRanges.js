import moment from "moment"

export const dateFormat = 'YYYY-MM-DD'
const to = moment().format(dateFormat)

export const dateRanges = {
  today: {from: moment().format(dateFormat), to, localeKey: 'dateRange.today' },
  yesterday: {from: moment().subtract(1, 'days').format(dateFormat), to: moment().subtract(1, 'days').format(dateFormat), localeKey: 'dateRange.yesterday'},
  last7Days: {from: moment().subtract(6, 'days').format(dateFormat), to, localeKey: 'dateRange.last7Days'},
  last30Days: {from: moment().subtract(29, 'days').format(dateFormat), to, localeKey: 'dateRange.last30Days'},
  last3Months: {from: moment().subtract(3, 'months').subtract(1, 'days').format(dateFormat), to, localeKey: 'dateRange.last3Months'},
  last6Months: {from: moment().subtract(6, 'months').subtract(1, 'days').format(dateFormat), to, localeKey: 'dateRange.last6Months'},
  lastYear: {from: moment().subtract(1, 'years').subtract(1, 'days').format(dateFormat), to, localeKey: 'dateRange.lastYear'}
}