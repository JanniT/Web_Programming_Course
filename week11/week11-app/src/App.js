// I used this in help of using routes: https://www.w3schools.com/react/react_router.asp
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import Header from './components/Header'
import MyContainer from './components/MyContainer'
import About from './components/About'

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<MyContainer />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
