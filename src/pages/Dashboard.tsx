import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  // Redirect to /admin
  return <Navigate to="/admin" replace />;
};

export default Dashboard;