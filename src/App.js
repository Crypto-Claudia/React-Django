import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; 
import Home from './components/Home'; 
import Login from './components/Login'; 
import Register from './components/Register'; 
import Dashboard from './components/Dashboard'; 
import Mypage from './components/Mypage';
import Update from './components/Update';
import UpdatePassword from './components/UpdatePassword';
import './css/base.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/check-auth/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          credentials: "include", // 세션 쿠키를 자동으로 포함
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  

  return (
    <Router>
      <h1><marquee bgcolor="#FF0000" direction="right">localhost:3000 ↔ 127.0.0.1:8000 (CORS ERROR)</marquee></h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">대시보드</Link></li>
              <li><Link to="/mypage">마이페이지</Link></li>
              <li>
                <Link
                  onClick={async () => {
                    const logoutResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/logout/`, {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                      },
                      credentials: "include", // 세션 쿠키를 포함
                    });
                    setIsAuthenticated(false);
                    const data = await logoutResponse.json();
                    document.cookie = `csrftoken=${data.data.csrftoken}; path=/;`;
                    localStorage.removeItem("salt");
                  }}
                >
                  로그아웃
                </Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/register">회원가입</Link></li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/mypage"
          element={isAuthenticated ? <Mypage /> : <Navigate to="/login" />}
        />
        <Route
          path="/update"
          element={isAuthenticated ? <Update /> : <Navigate to="/login" />}
        />
        <Route
          path="/updatepassword"
          element={isAuthenticated ? <UpdatePassword setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
