import './App.css';
import Navbar from './Navbar';
import Rec from './pages/Rec';
import Search from './pages/Search';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Footer from './Footer';
import Login from './pages/Login';
import SignUp from './pages/component/SignUp'; // Make sure to import SignUp
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/search" element={<Search />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<SignUp />} />
            <Route path="/recommendation" element={<Rec />} /> {/* Default route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
