import React, { useContext } from 'react';
import { AuthContext } from '../pages/AuthContext'; // Adjust the path as necessary

function Dashboard() {
  const { username } = useContext(AuthContext); // Correctly destructure 'username'
  
  // Optional: Handle cases where 'username' might still be undefined
  if (!username) {
    return <div className="error">User information is missing.</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username}!</h1>
      {/* Add more dashboard content here */}
    </div>
  );
}

export default Dashboard;
