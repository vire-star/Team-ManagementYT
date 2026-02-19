import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/User/Home'
import LandingPage from '@/Pages/User/LandingPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectRoute } from './ProtectRoute'
import Settings from '@/Pages/User/Settings'
import AcceptInvite from '@/Pages/User/AcceptInvite'
import SingleTask from '@/Pages/User/SingleTask'
import File from '@/Pages/User/File'

const MainRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={
          <ProtectRoute>
            <Home />
          </ProtectRoute>
        } />
        <Route path='/settings' element={
          <ProtectRoute>
            <Settings />
          </ProtectRoute>
        } />
        <Route path='/accept-invite/:id' element={
          <ProtectRoute>
            <AcceptInvite />
          </ProtectRoute>
        } />
        <Route path='/singleTask/:id' element={
          <ProtectRoute>
            <SingleTask />
          </ProtectRoute>
        } />
        <Route path='/file' element={
          <ProtectRoute>
            <File />
          </ProtectRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
       
    </Routes>
  )
}

export default MainRoutes