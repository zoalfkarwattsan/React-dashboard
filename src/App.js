import {useContext, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Router from '@src/router/Router'
import {AbilityContext} from '@src/utility/context/Can'
import {_getAppSettings} from "@store/actions/app"
import LogoSpinner from '@src/components/LogoSpinner'

const App = props => {
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    dispatch(
      _getAppSettings(
        () => {
          setReady(true)
        },
        ability
      )
    )
  }, [])
  return (
    !ready ? <LogoSpinner/> : <Router/>
  )
}

export default App
