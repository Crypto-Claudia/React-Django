import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/Login";
import Contact from "./components/Register";


function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">로그인</Link></li>
          <li><Link to="/register">회원가입</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<About />} />
        <Route path="/register" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
