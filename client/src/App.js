import './App.css';
import Navbar from './Navbar';
import Rec from './pages/Rec';
import Search from './pages/Search';
import Ranking from './pages/Ranking';
import About from './pages/About';

function App() {
  let Component;
  switch (window.location.pathname) {
    case "/search":
      Component = <Search />;
      break;
    case "/ranking":
      Component = <Ranking />;
      break;
    case "/about":
      Component = <About />;
      break;
    default:
      Component = <Rec />;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        {Component}
      </div>
    </div>
  );
}

export default App;
