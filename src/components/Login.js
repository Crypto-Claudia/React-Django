import React, { useState } from "react";

function Login() {
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, pw }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login Successful:", data);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="id" style={{ display: "block", marginBottom: "5px" }}>id:</label>
          <input
            type="id"
            id="id"
            value={id}
            onChange={(e) => setid(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="pw" style={{ display: "block", marginBottom: "5px" }}>pw:</label>
          <input
            type="pw"
            id="pw"
            value={pw}
            onChange={(e) => setpw(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
