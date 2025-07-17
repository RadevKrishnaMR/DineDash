// import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
  <Navbar />
  <main className="flex-1 p-6 pt-30">
    <Outlet />
  </main>
  <Footer/>
</div>
  );
};

export default DashboardLayout;