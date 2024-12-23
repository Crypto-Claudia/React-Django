import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Update() {
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    region: "",
    diseases: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 데이터를 불러옵니다.
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mypage/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(data.data); // 기존 데이터를 폼에 설정
        } else {
          setError("사용자 정보를 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다.:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/mypage"); // 성공 후 마이페이지로 리디렉션
        }, 3000);
      } else {
        setError("정보를 업데이트하는 데 실패했습니다.");
      }
    } catch (err) {
      console.error("업데이트 요청 중 오류가 발생했습니다.:", err);
      setError("업데이트 요청 중 오류가 발생했습니다.");
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  return (
    <div className="update-container">
      <h1>정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_id">ID:</label>
          <input
            type="user_id"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="region">Region:</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="diseases">Diseases:</label>
          <input
            type="text"
            id="diseases"
            name="diseases"
            value={formData.diseases}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">수정</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">정보가 성공적으로 수정되었습니다.</p>}
    </div>
  );
}

export default Update;
