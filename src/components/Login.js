import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link만 임포트

async function hashPasswordPBKDF2(password, salt) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const pbkdf2Key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"]
  );

  const hashBuffer = await crypto.subtle.sign("HMAC", pbkdf2Key, passwordBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function Login({ setIsAuthenticated }) {  // setIsAuthenticated를 props로 받음
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const saltResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/s/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!saltResponse.ok) {
        throw new Error("Failed to fetch salt.");
      }

      const { salt } = await saltResponse.json();
      const encryptedPw = await hashPasswordPBKDF2(pw, salt);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pw: encryptedPw }),
        credentials: "include",  // 세션 쿠키를 포함
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login Successful:", data);
        // HTTP 일 경우
        document.cookie = `sessionid=${data.data.session_id}; path=/;`;
        document.cookie = `csrftoken=${data.data.csrftoken}; path=/;`;
        localStorage.removeItem("salt");
        localStorage.setItem("salt", data.data.salt);
        localStorage.setItem("user_id", data.data.user_id);
        localStorage.setItem("email", data.data.email);
        localStorage.setItem("region", data.data.region);
        localStorage.setItem("diseases", data.data.diseases);
        localStorage.setItem("nickname", data.data.nickname);
        // HTTPS 일 경우
        // document.cookie = `sessionid=${data.data.session_id}; path=/; Secure; SameSite=Strict`;
        // document.cookie = `csrftoken=${data.data.csrftoken}; path=/; Secure; SameSite=Strict`;

        // React 상태 업데이트
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">아이디:</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pw">비밀번호:</label>
          <input
            type="password"
            id="pw"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary">로그인</button>
        <Link to="/register"><button>회원가입</button></Link>
      </form>
    </div>
  );
}

export default Login;
