// ** React Imports
import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'

// ** Redux Imports
import { Provider } from 'react-redux'
import { store } from './redux/storeConfig/store'

// ** Intl, CASL & ThemeColors Context
import ability from '@configs/acl/ability'
import { ToastContainer } from 'react-toastify'
import { AbilityContext } from '@src/utility/context/Can'
import { ThemeContext } from '@src/utility/context/ThemeColors'
import { IntlProviderWrapper } from '@src/utility/context/Internationalization'
import {GlobalDefinitionsProviderWrapper} from "@csrc/utility/context/GlobalDefinitions"

// ** Spinner (Splash Screen)
import Spinner from '@components/spinner/Fallback-spinner'

// ** Ripple Button
import '@components/ripple-button'

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss'

// ** Core styles
import '@assets/fonts/feather/iconfont.css'
import '@styles/core.scss'
import '@src/assets/scss/style.scss'
import './assets/scss/style.scss'

// ** Service Worker
import * as serviceWorker from './serviceWorker'

// ** Langs
import {genLang} from "./assets/data/locales"

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

import PluggedInModules from "./configs/PluggedInModules"

let additionalLangs = {
    en : {...genLang.en},
    ar : {...genLang.ar},
    tr : {...genLang.tr}
}

// ** Merge Routes
_.forEach(PluggedInModules, (module, _i) => {
    if (module.path.Lang) {
        additionalLangs = {
            en : {...additionalLangs.en, ...module.path.Lang.en},
            ar : {...additionalLangs.ar, ...module.path.Lang.ar},
            tr : {...additionalLangs.tr, ...module.path.Lang.tr}
        }
    }
})

ReactDOM.render(
    <Provider store={store}>
        <Suspense fallback={<Spinner />}>
            <AbilityContext.Provider value={ability}>
                <ThemeContext>
                    <IntlProviderWrapper additionalLangs={additionalLangs}>
                        <GlobalDefinitionsProviderWrapper>
                            <LazyApp />
                            <ToastContainer newestOnTop />
                        </GlobalDefinitionsProviderWrapper>
                    </IntlProviderWrapper>
                </ThemeContext>
            </AbilityContext.Provider>
        </Suspense>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
