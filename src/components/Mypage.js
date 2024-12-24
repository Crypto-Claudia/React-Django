import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function Mypage() {
  const [userData, setUserData] = useState(null);
  const [accessHistory, setAccessHistory] = useState([]);  // 접속 이력 상태 관리
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 데이터 가져오기
        const responseUser = await fetch(`${process.env.REACT_APP_API_URL}/api/mypage/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
        });

        if (responseUser.ok) {
          const data = await responseUser.json();
          setUserData(data.data);
        } else {
          setError("알 수 없는 오류가 발생하였습니다.");
        }

        // 접속 이력 가져오기
        const responseHistory = await fetch(`${process.env.REACT_APP_API_URL}/api/history/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          credentials: "include",
        });

        if (responseHistory.ok) {
          const dataHistory = await responseHistory.json();
          setAccessHistory(dataHistory.data);
        } else {
          setError("접속 이력을 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("데이터를 받아오는데 실패했습니다.:", err);
        setError("데이터를 받아오는데 실패했습니다.");
      }
    };

    fetchData(); 
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const getResultMessage = (resultCode) => {
    switch (resultCode) {
      case 0:
        return "회원가입";
      case 1:
        return "로그인 성공";
      case 2:
        return "로그인 실패";
      case 3:
        return "회원정보 수정";
      case 4:
        return "비밀번호 수정";
      default:
        return "알 수 없는 결과";
    }
  };

  const getTrId = (resultCode) => {
    if (resultCode === 2) {
      return "failure-row";
    } else {
      return "success-row";
    }
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      {error && <p className="error-message">{error}</p>}
      {userData ? (
        <div className="user-info">
          <p><strong>ID:</strong> {userData.user_id}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Region:</strong> {userData.region}</p>
          <p><strong>Diseases:</strong> {userData.diseases}</p>
          <p>&nbsp;</p>
          <Link to="/update"><button>정보수정</button></Link>
          <hr />
          <Link to="/updatePassword"><button>비밀번호수정</button></Link>
          <hr />
          <p>&nbsp;</p>
          <h1>보안이력</h1>
          {accessHistory.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>발생 시간</th>
                  <th>요청 IP</th>
                  <th>결과</th>
                </tr>
              </thead>
              <tbody>
              {accessHistory.slice().reverse().map((history, index) => (
                <tr key={index} class={getTrId(history.result)}> 
                    <td>{new Date(history.access_time).toLocaleString()}</td>
                    <td>{history.access_ip}</td>
                    <td>{getResultMessage(history.result)}</td> 
                </tr>
              ))}  

              </tbody>
            </table>
          ) : (
            <p>접속 이력이 없습니다.</p>
          )}
        </div>
      ) : (
        !error && <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Mypage;
