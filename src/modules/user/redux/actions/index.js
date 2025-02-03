import _ from "lodash"
import Cookies from 'js-cookie'
//************************************//
import {API, API_WithSwal} from '../../utility/API'
import {_changeAppLang, _getAppLang, _setAPIToken} from '@utils'

//************************************//
export const _login = (data, callback, callbackErr = () => {}) => {
    API.post('login', data)
        .then(function (res) {
            callback(res)
        })
        .catch(function (res) {
            callbackErr(res)
        })
}
//************************************//
export const _setUserToken = (json) => {
  const token = JSON.stringify(json)
  sessionStorage.setItem("USER_TOKEN", token)
  Cookies.set("USER_TOKEN", token)
  if (json.user.locale && json.user.locale !== _getAppLang()) {
    _changeAppLang(json.user.locale)
  }
}
//************************************//
export const _removeUserToken = () => {
  sessionStorage.removeItem("USER_TOKEN")
  localStorage.removeItem("USER_TOKEN")
  Cookies.remove("USER_TOKEN")
}
//************************************//
export const _autoLogin = (dispatch, ability, callback) => {
    const storageUserToken = JSON.parse(localStorage.getItem('USER_TOKEN'))
    const cookieUserToken = Cookies.get('USER_TOKEN') ? JSON.parse(Cookies.get('USER_TOKEN')) : false
    const user = (cookieUserToken || storageUserToken || false)
    if (user && user.token && user.user) {
        _setUserToken(user)
        _setAPIToken(user.token)
        dispatch({type: "USER_LOGIN", userData: user.user, token: user.token})
        // if (user.user.abilities) {
        //   ability.update(user.user.abilities)
        //
        // }
        ability.update([
            {
                subject: 'all',
                action: 'manage'
            }
        ])
        callback()
        // } else if (user = (storageUserToken || false)) {
        //
        //   if (user && user.token && user.email) {
        //     API.post('/check-token', {email: user.email, token: user.token})
        //       .then(function (res) {
        //         if (res.data.token) {
        //           const {data} = res
        //           _setUserToken({email: user.email, token: data.token, user: data.user})
        //           _setAPIToken(data.token)
        //           dispatch({type: "USER_LOGIN", userData: data.user, token: data.token})
        //           if (data.user.abilities) {
        //             ability.update(data.user.abilities)
        //           }
        //         }
        //         callback()
        //       })
        //       .catch(function (res) {
        //         _removeUserToken()
        //         callback()
        //       })
        //   }
    } else {
        callback()
    }
}

//***************** Admins *******************//
export const _addAdmin = (data, callback, callbackErr = () => {}) => {
  API_WithSwal.post(`/Managment/CreateUser`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editAdminInfo = (data, callback, callbackErr = () => {}) => {
  API_WithSwal.put(`/Managment/UpdateUser`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteAdmin = (id, callback) => {
  API_WithSwal.delete(`/Managment/DeleteUser?id=${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//***************** Responsibles *******************//
export const _getResponsible = (id, callback, callbackErr = () => {}) => {
  API.get(`/Managment/ReadUser?filter=id~eq~'${id}'`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
      // callbackErr(data.errors)
    })
}
//************************************//
export const _addResponsible = (data, callback, callbackErr = () => {}) => {
  API_WithSwal.post(`/Users`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editResponsibleInfo = (data, callback, callbackErr = () => {}) => {
  API_WithSwal.put(`/Users/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteResponsible = (id, callback) => {
  API.delete(`/Users/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _activateTeamMember = (id, callback) => {
  API.delete(`responsible/activateTeamMember/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _deactivateTeamMember = (id, callback) => {
  API.delete(`responsible/deActivateTeamMember/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _getAllResponsiblesWithQ = async (q = '') => {
  const {data} =  await API.get('responsible/getAllResponsiblesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.responsibles, (v, k) => {
    return {value: v.id, label: `${v.fname} ${v.mname} ${v.lname}`}
  })
}
//***************** Notifications *******************//
export const _sendPushNotification = (data, callback, callbackErr = () => {}) => {
  API_WithSwal.post(`/notifications`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _getAllAdminsWithQ = async (q = '') => {
  const {data} =  await API.get('admin/getAllAdminsWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.municipalities, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _getAllRolesWithQ = async (q = '') => {
  const {data} =  await API.get('getAllRolesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.roles, (v, k) => {
    return {value: v.id, label: v.name.replace("_", " ")}
  })
}
//************************************//
export const _getAllRoles = (callback = () => {}) => {
  API.get('Managment/ReadRole')
      .then(({data}) => {
          callback(data)
      })
}
//************************************//
export const _loginTwoFactor = ({email, code}, callback, callbackErr = () => {}) => {
  API.post('/login-2fa', {email, code})
    .then(function (res) {
      callback(res)
    })
    .catch(function ({data}) {
      callbackErr(data)
    })
}
//************************************//
export const _register = ({firstName, lastName, email}, callback, callbackErr = () => {}) => {
    API.post('/register', {first_name: firstName, last_name: lastName, email})
        .then(function ({data}) {
            callback(data)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _forgetPassword = ({email}, callback, callbackErr = () => {}) => {
    API.post('/forget-password', {email})
        .then(function ({data}) {
            callback(data)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _resetPassword = ({email, currentPassword, newPassword}, callback, callbackErr = () => {}) => {
    API.post('/reset-password', {email, current_password:currentPassword, new_password:newPassword})
        .then(function (res) {
            callback(res)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _changePassword = (data, callback, callbackErr = () => {}) => {
  API.post('/user/account/change-password', {...data})
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
      callbackErr(data.data)
    })
}
//************************************//
export const _logout = () => {
    return dispatch => {
      // ** Remove user, accessToken & refreshToken from storages
      _removeUserToken()
      _setAPIToken('')
      dispatch({ type: 'USER_LOGOUT' })
    }
}
//************************************//
export const _getMyProfile = (dispatch) => {
    API.get('/user/account/my-profile')
        .then(function ({data}) {
            const userToken = JSON.parse(sessionStorage.getItem('USER_TOKEN'))
            userToken.user = {...userToken.user, ...data.basic_info}
            sessionStorage.setItem("USER_TOKEN", JSON.stringify(userToken))
            dispatch({type: 'USER_MY_PROFILE', data})
        })
        .catch(function (res) {})
}
//************************************//
export const _changeBasicInfo = (data, callback, callbackErr = () => {}) => {
    return dispatch => {
        API.post('/user/account/change-basic-info', data)
          .then(function ({data}) {
              _getMyProfile(dispatch)
          })
          .catch(function ({data}) {
              callbackErr(data.data)
          })
    }

}
//************************************//
export const _changeGeneralInfo = (data, callback, callbackErr = () => {}) => {
    return dispatch => {
        API.post('/user/account/change-general-info', {...data})
          .then(function ({data}) {
              _getMyProfile(dispatch)
          })
          .catch(function ({data}) {
              callbackErr(data.data)
          })
    }

}
//************************************//
export const _saveSupportEmail = (data, callback, callbackErr = () => {}) => {
    API.post('support/store', {...data})
      .then(function ({data}) {
      })
      .catch(function ({data}) {
          callbackErr(data.data)
      })

}


//***************** Roles & Permissions *******************//

//************************************//
export const _getUnitWithJobs = (id, callback) => {
  API.get(`unit/get-jobs/${id}`)
    .then(({data}) => {
      callback(data)
    })
}
//************************************//
export const _getPermissions = (callback) => {
  API.get(`permissions`)
    .then(({data}) => {
      callback(data)
    })
}
//************************************//
export const _getExistedPermissionsWithUnitAndJobAndPermission = (params, callback) => {
  API.get(`permissions/get-existed/with-unit-job-permission`, {
    params
  })
    .then(({data}) => {
      callback({
        ...data,
        data_levels: _.map(data.data_levels, x => ({...x, name: `${x.name}-${x.level}-${x.rank_category}`}))
      })
    })
}
//************************************//
export const _saveRolesVsPermissionsVsDocumentTypes = (data, callback, callbackError, callbackFinal) => {
  API.post(`roles_vs_permissions_vs_document_types`, data)
    .then(callback)
    .catch(callbackError)
    .finally(callbackFinal)
}
//************************************//
export const _getAllPermissionLevelsWithQ = async (q = '') => {
  const {data} =  await API.get('permissions/getAllPermissionLevelsWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.data, (v, k) => {
    return {value: v.id, label: v.label}
  })
}
//************************************//
export const _getAllGovernoratesWithQ = async (q = '') => {
  const {data} =  await API.get('Governorates/index/search', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.list, (v, k) => {
    return {value: v.Id, label: v.Name}
  })
}
//************************************//
export const _getAllAreasWithQ = async (q = '', governorate_id = null) => {
  const {data} =  await API.get('Areas/index/search', {
    params: {
      limit: 20,
      q,
      governorate_id
    }
  })
  return _.map(data.list, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _getAllVillagesWithQ = async (q = '', area_id = null) => {
  const {data} =  await API.get('Villages/index/search', {
    params: {
      limit: 20,
      q,
      area_id
    }
  })
  return _.map(data.list, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _getAllBreedersWithQ = async (q = '', village_id = null) => {
  const {data} =  await API.get('Breeders/index/search', {
    params: {
      limit: 20,
      q,
      village_id
    }
  })
  return _.map(data.list, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _addGovernorate = (data, callback, callbackErr = () => {}) => {
  API.post(`/Governorates`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _addArea = (data, callback, callbackErr = () => {}) => {
  API.post(`/Areas`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _addVillage = (data, callback, callbackErr = () => {}) => {
  API.post(`/Villages`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _addBreeder = (data, callback, callbackErr = () => {}) => {
  API.post(`/Breeders`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}

//***************** characteristics *******************//
export const _getSeriesWithDetails = (categoryId, callback, callbackErr = () => {}) => {
    API.get(`/Series/ReadWithDetails?filter=categoryId~eq~'${categoryId}'`)
        .then(function ({data}) {
            callback(data)
        })
        .catch(function (data) {
            callbackErr(data?.data?.errors)
        })
}
//************************************//
export const _editCategory = (data, callback, callbackErr = () => {}) => {
    API_WithSwal.put(`/Categories/Update`, data)
        .then(function ({data}) {
            callback(data)
        })
        .catch(function (data) {
            callbackErr(data?.data?.errors)
        })
}
//************************************//
export const _editSeries = (data, callback, callbackErr = () => {}) => {
    API_WithSwal.put(`/Series/Update`, data)
        .then(function ({data}) {
            callback(data)
        })
        .catch(function (data) {
            callbackErr(data?.data?.errors)
        })
}
//************************************//
export const _editStaticCharacteristic = (data, callback, callbackErr = () => {}) => {
    API_WithSwal.put(`/StaticCharacteristic/Update`, data)
        .then(function ({data}) {
            callback(data)
        })
        .catch(function (data) {
            callbackErr(data?.data?.errors)
        })
}
// //************************************//
// export const _editAdminInfo = (data, callback, callbackErr = () => {}) => {
//     API_WithSwal.put(`/admins/${data.id}`, data)
//         .then(function ({data}) {
//             callback(data)
//         })
//         .catch(function (data) {
//             callbackErr(data?.data?.errors)
//         })
// }
// //************************************//
// export const _deleteAdmin = (id, callback) => {
//     API.delete(`/admins/${id}`)
//         .then(function ({data}) {
//             callback(data)
//         })
//         .catch(function ({data}) {
//         })
// }
