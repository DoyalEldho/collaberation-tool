import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 min-h-screen bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
