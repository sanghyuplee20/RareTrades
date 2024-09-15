import './App.css';
import Navbar from './Navbar';
import Rec from './pages/Rec';
import Search from './pages/Search';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Footer from './Footer';
import LoginForm from './pages/component/LoginForm';
import SignUp from './pages/component/SignUp';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './pages/AuthContext'; // Corrected import path
import PrivateRoute from './pages/component/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              {/* "Recommendations" is accessible to all users */}
              <Route path="/recommendation" element={<Rec />} />

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

              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/join" element={<SignUp />} />

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