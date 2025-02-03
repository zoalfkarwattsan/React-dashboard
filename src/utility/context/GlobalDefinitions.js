// ** Imports createContext function
import React, {createContext, useState} from 'react'
import {useSelector} from "react-redux"
import _ from 'lodash'
import moment from "moment/moment"
import * as yup from 'yup'

import {phpToMomentFormat} from "@utils"

import UnAvailableFeatureModal from "../../components/FeaturesComponents/UnAvailableFeatureModal"
import {checkFeatureAvailability as checkAvailability} from "../Utils"

// ** Create Context
const GlobalDefinitionsContext = createContext()

const GlobalDefinitionsProviderWrapper = ({children}) => {
	const dateFormat = useSelector(state => _.get(state, 'app.settings.app.date_format'))

	yup.addMethod(yup.string, 'dateFormat', function () {
		return this.transform(function (value, originalValue) {
			return moment(value).format(phpToMomentFormat(dateFormat))
			// return isMoment(value) ? moment(value).format(format) : originalValue
		})
	})

	const plan = useSelector(store => _.get(store, 'app.plan', 'free'))
	const [showUnAvailableFeatureModal, setShowUnAvailableFeatureModal] = useState({show: false, key: ''})

	const checkFeatureAvailability = (featureKey) => {
		return checkAvailability(featureKey)
	}

	const openUnAvailableFeatureModal = (key) => {
		setShowUnAvailableFeatureModal({show: true, key})
	}

	const closeUnAvailableFeatureModal = (key) => {
		setShowUnAvailableFeatureModal({show: false, key: ''})
	}

	return (
		<GlobalDefinitionsContext.Provider value={{checkFeatureAvailability, openUnAvailableFeatureModal}}>
			{children}
			{showUnAvailableFeatureModal.show && <UnAvailableFeatureModal featureKey={showUnAvailableFeatureModal.key} onClose={closeUnAvailableFeatureModal} />}
		</GlobalDefinitionsContext.Provider>
	)
}

export {GlobalDefinitionsProviderWrapper, GlobalDefinitionsContext}
