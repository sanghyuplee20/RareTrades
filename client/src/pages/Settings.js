// pages/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../pages/AuthContext';

function Dashboard() {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {auth.username}!</h1>
      {/* Add dashboard content here */}
    </div>
  );
}

export default Dashboard;