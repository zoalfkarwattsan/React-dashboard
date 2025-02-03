import axios from 'axios'
import qs from 'qs'
import {createBrowserHistory} from 'history'

import {store} from '@fwsrc/redux/storeConfig/store'
import {_logout} from "../redux/actions"
import {_setGlobal, _getGlobal, _loading, _historyPush, _isOnline, API} from "@utils"
import _ from "lodash"
import PluggedInModules from "@fwsrc/configs/PluggedInModules"

export const isUserLoggedIn = () => _.get(store.getState(), 'user.token')
export const getUserData = () => _.get(store.getState(), 'user.userData')

