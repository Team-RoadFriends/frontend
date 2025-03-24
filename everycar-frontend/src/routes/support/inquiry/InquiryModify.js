import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserInfo from '../../../components/hooks/useUserInfo';
import "../../../css/routes/support/inquiry/InquiryModify.css";

function InquiryModify() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        inquiries_q: "", // 질문 내용
    });
    const { loading, userInfo } = useUserInfo();

    useEffect(() => {
        // 페이지가 로드될 때마다 스크롤을 맨 위로 이동
        window.scrollTo(0, 0);
    }, []);

    // 기존 데이터 불러오기
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/inquiry/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData({ inquiries_q: data.inquiries_q });
            })
            .catch((error) => {
                console.error("Error fetching inquiry data:", error);
            });
    }, [id]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 문의 수정 요청
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.inquiries_q.trim()) {
            alert("질문 내용을 입력해주세요.");
            return;
        }

        const token = localStorage.getItem("accessToken"); // 토큰을 로컬스토리지에서 가져옴

        // POST 방식으로 수정 요청 보내기
        fetch(`${API_BASE_URL}/api/inquiry/${id}`, {
            method: "POST", // POST 방식으로 수정
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Authorization 헤더 추가
            },
            body: JSON.stringify(formData), // formData를 JSON으로 변환하여 보내기
        })
            .then((response) => {
                if (response.ok) {
                    alert("문의가 수정되었습니다.");
                    navigate(`/support/inquiryDetail/${id}`); // 수정 후 해당 상세 페이지로 이동
                } else {
                    return Promise.reject("문의 수정 실패");
                }
            })
            .catch((error) => {
                console.error("Error updating inquiry:", error);
            });
    };

    return (
        <div className="inquiry-modify-container">
            <h2 className="inquiry-modify-title">문의 수정하기</h2>

            <div className="inquiry-notice-box">
                에브리카 홈페이지 이용 관련 고객문의 게시판 입니다.<br></br><br></br>
                - 답변은 영업일 기준 09:00~18:00에 순차적으로 처리되며, 긴급한 장애 관련 문의는 전화로 접수해 주시기 바랍니다. <br></br>
                - 홈페이지를 통한 문의는 절차상 빠른 답변이 어려울 수 있습니다. (답변 기한 7일, 추가 검토가 필요한 경우 14일) <br></br>
                - 욕설이나 서비스와 상관없는 내용의 문의는 관리자에 의해 비공개 처리될 수 있습니다.
            </div>

            <form onSubmit={handleSubmit} className="inquiry-form">
                <div className="form-group">
                    <label htmlFor="inquiries_q">문의 내용 수정</label>
                    <textarea
                        id="inquiries_q"
                        name="inquiries_q"
                        value={formData.inquiries_q}
                        onChange={handleChange}
                        placeholder="문의 내용을 수정하세요..."
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => navigate("/support/inquiry")}>
                        취소
                    </button>
                    <button type="submit" className="submit-button">
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
}

export default InquiryModify;
