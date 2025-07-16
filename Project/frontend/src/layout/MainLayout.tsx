import React from 'react'
import { Navbar,Footer } from '../components'


const MainLayout = () => {
  return (
   <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <div className='flex-1 p-4 bg-grey-100'>
            Main Content
        </div>
        <Footer></Footer>
   </div>
  )
}

export default MainLayout