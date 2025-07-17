// import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
