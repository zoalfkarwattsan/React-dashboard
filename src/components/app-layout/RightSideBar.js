// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Mail, PhoneCall, Clock, Tag, Star, Image, Trash, Slash } from 'react-feather'

const RightSideBar = props => {
  // ** Props
  const { handleSidebarRight, sidebarRight } = props

  const closeSideBar = () => {
    handleSidebarRight()
  }

  return (
    <div className={classnames('user-profile-sidebar', { show: sidebarRight === true })}>
    </div>
  )
}

export default RightSideBar
