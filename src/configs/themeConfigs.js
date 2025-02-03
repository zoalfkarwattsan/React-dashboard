import {Cloud}  from 'react-feather'

import {trans} from '@utils'

const localConfigs = {
  app: {
    appName: 'global.wattsan',
    appLogoImage: require('@csrc/assets/images/logo/logo.png').default,
    images:{
      login:  require(`@csrc/assets/images/logo/logo-full.png`).default,
      loginDark:  require(`@csrc/assets/images/logo/logo-full-dark.png`).default,
      register:  require(`@csrc/assets/images/logo/logo-full.png`).default,
      registerDark:  require(`@csrc/assets/images/logo/logo-full-dark.png`).default,
      forgetPassword:  require(`@csrc/assets/images/logo/logo-full.png`).default,
      forgetPasswordDark:  require(`@csrc/assets/images/logo/logo-full-dark.png`).default
    },
    footerUrl:'#'
  },
  layout: {
    isRTL: false,
    skin: 'semi-dark', // light, dark, bordered, semi-dark
    skinOptions: {
      "semi-dark": {nextSkin: 'dark', icon: <Cloud className='ficon'/>}
    },
    routerTransition: 'fadeIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'vertical', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      type: 'floating',
      backgroundColor: 'white'
    },
    footer: {
      type: 'sticky'
    },
    customizer: false,
    scrollTop: true
  }
}
export default localConfigs
