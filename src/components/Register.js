import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPw2, setUserPw2] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!userId || !userPw || !userPw2) {
            setErrorMessage("아이디, 비밀번호를 입력해주세요.");
            return;
        }

        if(userPw !== userPw2) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        const salt = generateRandomString(50);
        const hashedPassword = await hashPasswordPBKDF2(userPw, salt);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: userId,
                    pw: hashedPassword,
                    email: email,
                    nickname: nickname,
                    salt: salt,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage(data.message);
                setErrorMessage("");
                // 폼 초기화
                setUserId("");
                setUserPw("");
                setEmail("");
                setNickname("");
                setTimeout(() => {
                    navigate('/login', {replace: true}); // 성공 후 로그인 페이지로 리디렉션
                }, 2000);
            } else {
                setErrorMessage(data.message || "회원가입에 실패했습니다.");
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage("서버 요청 중 오류가 발생했습니다.");
            setSuccessMessage("");
        }
    };

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

    function generateRandomString(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from(array, (byte) => characters[byte % characters.length]).join("");
    }

    return (
        <div className="register-container">
            <h1>회원가입</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="user-id">아이디</label>
                    <input
                        type="text"
                        id="user-id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="user-pw">비밀번호</label>
                    <input
                        type="password"
                        id="user-pw"
                        value={userPw}
                        onChange={(e) => setUserPw(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="user-pw">비밀번호</label>
                    <input
                        type="password"
                        id="user-pw2"
                        value={userPw2}
                        onChange={(e) => setUserPw2(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">이메일 (선택)</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="nickname">닉네임 (선택)</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
}

export default Register;
