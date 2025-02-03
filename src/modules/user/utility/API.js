import axios from 'axios'
import qs from 'qs'
import {_loading, _isOnline, _toast, _successSwal, _handleError, _inProgressApiCount, env} from "@utils"
import {toast, Slide} from 'react-toastify'

export const API = axios.create({
	baseURL: env('REACT_APP_BACKEND_BASE_URL'),
	headers: {dev: true, "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"*"},
	timeout: 2 * 60 * 1000
})

API.interceptors.request.use(function (config) {
	if (!_isOnline()) {
		if (config.sync) {
			config.silent = true
			throw ({sync: config.sync, config})
		} else {
			throw ({offline: true})
		}
	}
	if (config.silent !== true) {
		if (_inProgressApiCount('+').c === 0) {
			_loading(true)
		}
		//_toast(false)
	}

	if (config.params) {
		config.paramsSerializer = p => {
			return qs.stringify(p)
		}
	}

	if (config.data && !config.noStringify) {
		//config.data = qs.stringify(config.data)
	}
	//console.log(config)
	return config
}, function (error) {
	// Do something with request error
	return Promise.reject(error)
})
API.interceptors.response.use(
	function (response) {
		if (response.config.silent !== true) {
			if (_inProgressApiCount('-').n === 0) {
				_loading(false)
			}
			if (response.data.message) {
				if (response.data.message !== '') {
					_toast(response.data.message, 'success')
				}
			}
		}
		return response.data
	},
	function (error) {
		if (error.config.silent !== true) {
			if (_inProgressApiCount('-').n === 0) {
				_loading(false)
			}
		}
		if (error.response) {
			// if (_.get(error, 'response.message') !== '') {
			// 	// _toast(error.response.message, 'error')
			// }
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			//console.log(error.response.data, error.response.status, error.response)
			if (error.config.silent !== true) {
				if (error.response.data.error !== '') {
					console.log(error.response.data)
					_handleError(error.response.data.error_code, error.config)
					_toast(error.response.data.message, 'error')
				}
			} else {
				console.log(error)
			}

		} else if (error.request) {
			console.log(error.request)
			if (error.request._response) {
				// _toast(error.request._response,'error')
			}
		} else if (error.sync) {
			//_storeSyncRequest(error.config,error.sync)
		} else if (error.offline) {
			//_toast(t('desktop.NO_INTERNET'),'error')
		} else {
			console.log('Error', error.message)
		}
		return Promise.reject(error.response)
	})

export const API_WithSwal = axios.create({
	baseURL: env('REACT_APP_BACKEND_BASE_URL'),
	headers: {dev: true, "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"*"},
	timeout: 2 * 60 * 1000
})

API_WithSwal.interceptors.request.use(function (config) {
	if (!_isOnline()) {
		if (config.sync) {
			config.silent = true
			throw ({sync: config.sync, config})
		} else {
			throw ({offline: true})
		}
	}
	if (config.silent !== true) {
		if (_inProgressApiCount('+').c === 0) {
			_loading(true)
		}
		//_toast(false)
	}

	if (config.params) {
		config.paramsSerializer = p => {
			return qs.stringify(p)
		}
	}

	if (config.data && !config.noStringify) {
		//config.data = qs.stringify(config.data)
	}
	//console.log(config)
	return config
}, function (error) {
	// Do something with request error
	return Promise.reject(error)
})
API_WithSwal.interceptors.response.use(
	function (response) {
		if (response.config.silent !== true) {
			if (_inProgressApiCount('-').n === 0) {
				_loading(false)
			}
			_successSwal()
		}
		return response.data
	},
	function (error) {
		if (error.config.silent !== true) {
			if (_inProgressApiCount('-').n === 0) {
				_loading(false)
			}
		}
		if (error.response) {
			// if (_.get(error, 'response.message') !== '') {
			// 	// _toast(error.response.message, 'error')
			// }
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			//console.log(error.response.data, error.response.status, error.response)
			if (error.config.silent !== true) {
				if (error.response.data.error !== '') {
					console.log(error.response.data)
					_handleError(error.response.data.error_code, error.config)
					_toast(error.response.data.message, 'error')
				}
			} else {
				console.log(error)
			}

		} else if (error.request) {
			console.log(error.request)
			if (error.request._response) {
				// _toast(error.request._response,'error')
			}
		} else if (error.sync) {
			//_storeSyncRequest(error.config,error.sync)
		} else if (error.offline) {
			//_toast(t('desktop.NO_INTERNET'),'error')
		} else {
			console.log('Error', error.message)
		}
		return Promise.reject(error.response)
	})
export const Axios = {API, API_WithSwal}

