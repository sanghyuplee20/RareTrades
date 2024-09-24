// src/App.js

import './App.css';
import Navbar from './Navbar';
import Rec from './pages/Rec';
import Search from './pages/Search';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Footer from './Footer';
import LoginForm from './pages/component/LoginForm';
import SignUp from './pages/component/SignUp';
import Dashboard from './pages/Dashboard'; // Add Dashboard component
import Settings from './pages/Settings'; // Add Settings component
import CardDetail from './pages/CardDetail'; // Add CardDetail component
import ForgotPassword from './pages/ForgotPassword'; // Add ForgotPassword component
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './pages/AuthContext'; // Ensure correct path
import PrivateRoute from './pages/component/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/recommendation" element={<Rec />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/join" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New Route */}

              {/* Protected Routes */}
              <Route path="/search" element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              } />
              <Route path="/ranking" element={
                <PrivateRoute>
                  <Ranking />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />

              {/* Individual Card Pages */}
              <Route path="/cards/:brand/:id" element={<CardDetail />} />

              {/* Redirect root to /recommendation */}
              <Route path="/" element={<Navigate to="/recommendation" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
