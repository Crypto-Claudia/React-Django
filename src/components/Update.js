import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Update() {
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    region: "",
    subRegion: "",
    diseases: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [subRegions, setSubRegions] = useState({}); // 서버에서 불러온 subRegions 데이터
  const navigate = useNavigate();

  const diseasesList = ["천식", "알레르기", "폐 질환", "암", "당뇨병", "신장 질환", "관절염", "골다공증", "알츠하이머", "백내장", "파킨슨병", "심장 질환"];

  useEffect(() => {
    // 사용자 정보 불러오기
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
          const [region, subRegion = ""] = data.data.region.split(" ");
          setFormData({
            ...data.data,
            region,
            subRegion,
            diseases: data.data.diseases.split(","),
          });
        } else {
          setError("사용자 정보를 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다.:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchUserData();

    // 지역 및 하위 지역 데이터 불러오기
    const fetchRegionData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getAddressInfo`);
        if (response.ok) {
          const data = await response.json();
          setSubRegions(data.data); // 서버에서 받은 지역 데이터를 상태로 저장
        } else {
          setError("지역 데이터를 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("지역 데이터를 불러오는데 실패했습니다.", err);
        setError("지역 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchRegionData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "region") {
        // 선택된 region에 따라 subRegion 초기화
        return { ...prevData, region: value, subRegion: subRegions[value] ? "" : "" };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleDiseaseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedDiseases = checked
        ? [...prevData.diseases, value]
        : prevData.diseases.filter((disease) => disease !== value);
      return { ...prevData, diseases: updatedDiseases };
    });
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
        body: JSON.stringify({
          ...formData,
          region: formData.subRegion ? `${formData.region} ${formData.subRegion}` : formData.region,
          diseases: formData.diseases.join(","),
        }),
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
          <label htmlFor="user_id">아이디:</label>
          <input
            type="text"
            id="user_id"
            name="userId"
            value={formData.user_id}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
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
          <label htmlFor="region">관측소 지역:</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            required
          >
            <option value="">관측소 지역을 선택하세요</option>
            {Object.keys(subRegions).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        {formData.region && subRegions[formData.region] && (
          <div className="form-group">
            <label htmlFor="subRegion">관측소 세부지역:</label>
            <select
              id="subRegion"
              name="subRegion"
              value={formData.subRegion}
              onChange={handleInputChange}
              required
            >
              <option value="">세부 지역을 선택하세요</option>
              {subRegions[formData.region].map((subRegion) => (
                <option key={subRegion} value={subRegion}>
                  {subRegion}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="diseases">Diseases:</label>
          <div className="checkbox-group">
            {diseasesList.map((disease) => (
              <label key={disease}>
                <input
                  type="checkbox"
                  name="diseases"
                  value={disease}
                  checked={formData.diseases.includes(disease)}
                  onChange={handleDiseaseChange}
                />
                {disease}
              </label>
            ))}
          </div>
        </div>
        <button type="submit">수정</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">정보가 성공적으로 수정되었습니다.</p>}
    </div>
  );
}

export default Update;