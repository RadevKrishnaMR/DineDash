import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header' // your custom header
// import Sidebar from './Sidebar' // optional, if you have a sidebar

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Example sidebar */}
      {/* <Sidebar /> */}

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet /> {/* Renders nested dashboard pages */}
        </main>
      </div>
    </div>
  )
}
