import React from 'react'

import MainRoutes from './Routes/MainRoutes'

import SideBar from './components/SideBar'
import { useLocation } from 'react-router-dom'

const App = () => {
  const hiddenRoute = ['/','/login','/register','/accept-invite/:id','/singleTask/:id']

  const location = useLocation()

  const shoudlHideNav = 
  location.pathname === '/' ||
  location.pathname === '/login' ||
  location.pathname === '/register' ||
  location.pathname.startsWith('/accept-invite')||
  location.pathname.startsWith('/singleTask')
  return (
    <div className='flex'>
    {!shoudlHideNav &&  <SideBar/>}
     <MainRoutes/>
    </div>
  )
}

export default App