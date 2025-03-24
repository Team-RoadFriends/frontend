import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserInfo from "../../../components/hooks/useUserInfo";
import "../../../css/routes/support/inquiry/InquiryDetail.css";
import axios from "axios";
function InquiryDetail() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const { id } = useParams();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState(null);
    const { loading, userInfo } = useUserInfo(); // 로그인된 사용자 정보

    useEffect(() => {
      // 페이지가 로드될 때마다 스크롤을 맨 위로 이동
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    if (!id) return;

        axios
            .get(`${API_BASE_URL}/api/inquiry/${id}`)
            .then((response) => {
                console.log("문의 상세 데이터:", response.data);
                setInquiry(response.data);
            })
            .catch((error) => {
                console.error("Error fetching inquiry detail:", error);
            });
    }, [id]);

  const handleDelete = () => {
    if (inquiry.inquiries_a) {
      alert("답변이 등록되어 삭제가 불가합니다.");
      return;
    }

        if (window.confirm("정말 삭제하시겠습니까?")) {
          fetch(`${API_BASE_URL}/api/inquiry/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
            .then(() => {
              alert("삭제되었습니다.");
              navigate("/support/inquiry");
            })
            .catch((error) => {
              console.error("Error deleting inquiry:", error);
            });
        }
      };

  const handleEdit = () => {
    if (inquiry.inquiries_a) {
      alert("답변이 등록되어 수정이 불가합니다.");
      return;
    }
    navigate(`/support/inquiryModify/${id}`);
  };

  if (!inquiry) {
    return <p>로딩 중...</p>;
  }

  // 작성자(userNum)와 로그인한 사용자가 동일한지 체크
  const isAuthor = userInfo && inquiry.userNum === userInfo.user_num;

  return (
    <div className="inquiry-detail-container">
      <h2 className="inquiry-detail-title">문의사항 상세</h2>

      <div className="inquiry-content">
        <h3 className="inquiry-question-title">질문</h3>
        <p className="inquiry-meta">작성일 : {inquiry.inquiries_q_created_at}</p>
        <p className="inquiry-question">{inquiry.inquiries_q}</p>
      </div>

      <div className="inquiry-answer">
        <h3 className="inquiry-answer-title">답변</h3>
        {inquiry.inquiries_a ? (
          <div>
            <p className="inquiry-meta">답변 등록일 : {inquiry.inquiries_a_created_at}</p>
            <p className="inquiry-answer-text">{inquiry.inquiries_a}</p>
          </div>
        ) : (
          <p className="no-answer">답변이 아직 없습니다.</p>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="inquiry-buttons">
        <div className="left-buttons">
          <button
            className="back-button-inquiry"
            onClick={() => navigate("/support/inquiry")}
          >
            목록으로 돌아가기
          </button>
        </div>

        {/* 수정 및 삭제 버튼은 작성자와 로그인한 사람이 같을 때만 보이도록 */}
        {isAuthor && (
          <div className="right-buttons">
            <button
              className="edit-button-inquiry"
              onClick={handleEdit}
            >
              수정
            </button>
            <button
              className="delete-button-inquiry"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="inquiry-notice">
        - 답변은 영업일 기준 09:00~18:00에 순차적으로 처리되며, 긴급한 장애 관련 문의는 전화로 접수해 주시기 바랍니다. <br></br>
        - 홈페이지를 통한 문의는 절차상 빠른 답변이 어려울 수 있습니다. (답변 기한 7일, 추가 검토가 필요한 경우 14일) <br></br>
        - 욕설이나 서비스와 상관없는 내용의 문의는 관리자에 의해 비공개 처리될 수 있습니다.
      </div>

    </div>
  );
}

export default InquiryDetail;
