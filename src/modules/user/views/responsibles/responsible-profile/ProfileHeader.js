import { useState } from 'react'
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather'
import { Card, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button } from 'reactstrap'

import {_url} from '@utils'
import {FallBackImage} from '@src/components'

import ResponsibleTabs from "./ResponsibleTabs"

const ProfileHeader = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Card className='profile-header mb-2'>
      <CardImg src={require('../../../../../assets/images/logo/logo.png').default} alt='User Profile Image' top />
      <div className='position-relative'>
        <div className='profile-img-container d-flex align-items-center'>
          <div className='profile-img'>
            <FallBackImage className='rounded img-fluid' src={require('../../../assets/images/avatar.png').default} alt='Profile image' />
          </div>
          <div className='profile-title ml-3'>
            <h2 className='bg-light rounded py-25 px-1'>{data.firstName} {data.lastName}</h2>
          </div>
        </div>
      </div>
      <div className='profile-header-nav'>
        <Navbar className='justify-content-end justify-content-md-between w-100' expand='md' light>
          <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
            <AlignJustify size={21} />
          </Button>
          <Collapse isOpen={isOpen} navbar>
            <ResponsibleTabs />
          </Collapse>
        </Navbar>
      </div>
    </Card>
  )
}

export default ProfileHeader
