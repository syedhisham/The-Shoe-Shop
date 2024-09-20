import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="layout">
      <div className="main-content">
        <Header/>
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
