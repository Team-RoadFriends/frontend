import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveReservation } from "../../redux/reservationSlice";
import { vwFont } from "../../utils";

const loadingGif = "/Loading.gif"; // public 폴더에 있는 로딩 GIF

const Payment = ({ payAmount, agree, car, return_location, selectedCity, selectedRegion }) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { startDate, startTime, endDate, endTime, reservationType } = useSelector((state) => state.rent);
    const userInfo = useSelector(state => state.user.userInfo);

    const userNum = userInfo?.userNum;
    const [depositorName, setDepositorName] = useState("");

    const [loading, setLoading] = useState(false); // 🚀 로딩 상태 추가

    /** 🚀짜 변환 함수 (백엔드에서 요구하는 형식) */
    const formatDateTime = (date, time) => {
        return `${date} ${time}:00`; // "YYYY-MM-DD HH:MM:SS" 형식
    };

    /** 결제 실행 */
    const handlePayment = () => {
        if (!agree) {
            alert("이용약관에 동의해주세요.");
            return;
        }

        setLoading(true); // 🔥 로딩 시작

        setTimeout(() => {
            // 예약 유형에 따라 올바른 주문 생성
            handleReservation(`BANK_${Date.now()}`);
        }, 2000);

    };

    /** 결제 성공 후 예약 요청 실행 */
    const handleReservation = async (orderId) => {
        if (!orderId) {
            console.error("주문번호(orderId)가 없습니다.");
            return;
        }

        if (!car?.car_id || !userNum) {
            console.error("예약 요청에 필요한 필수 값이 없습니다.", {
                car_id: car?.car_id,
                user_num: userNum
            });
            alert("예약 요청에 필요한 정보가 부족합니다.");
            return;
        }

        // 예약 유형에 따라 올바른 API 데이터 구성
        let reservationData;
        let apiUrl;

        if (reservationType === "quick") {
            reservationData = {
                car_id: car.car_id,
                rental_datetime: formatDateTime(startDate, startTime),
                return_location: return_location,
                return_datetime: formatDateTime(endDate, endTime),
                payment: payAmount,
                user_num: userNum
            };
            apiUrl = `${API_BASE_URL}/api/quick-rent/reservations`;
        } else {
            reservationData = {
                car_id: car.car_id,
                rental_station_start: return_location, // 백엔드에서 요구하는 필드명으로 변경
                reservation_s_start_date: formatDateTime(startDate, startTime),
                reservation_s_end_date: formatDateTime(endDate, endTime),
                user_num: userNum
            };

            // 선택된 도/시와 구 정보가 존재하면 추가
            if (selectedCity) reservationData.selectedCity = selectedCity;
            if (selectedRegion) reservationData.selectedRegion = selectedRegion;

            apiUrl = `${API_BASE_URL}/api/short-rent/reservations`;
        }

        // console.log("예약 요청 데이터:", reservationData);
        // console.log("API 요청 URL:", apiUrl);

        try {
            const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("백엔드 응답 오류:", errorResponse);
                throw new Error(`예약 실패! ${errorResponse.error || "Unknown Error"}`);
            }

            const result = await response.json();
            // console.log("예약 성공:", result);

            handleReservationSuccess(result);
            navigate("/reservation/paymentSuccess");
        } catch (error) {
            console.error("예약 오류:", error.message);
            alert(`예약 중 오류 발생: ${error.message}`);
        }
    };

    /** Redux 저장 시 순환 참조 제거 */
    const handleReservationSuccess = (reservationData) => {
        const safeReservationData = JSON.parse(JSON.stringify(reservationData)); // 순환 참조 제거
        dispatch(saveReservation({ userNum: userNum, reservationData: safeReservationData }));
    };

    return (
        <div style={{ position: "relative" }}>
            {loading ? ( // 🔥 로딩 화면 표시
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 9999
                }}>
                    <img src={loadingGif} alt="로딩 중..." width={100} />
                </div>
            ) : (
                <button
                    onClick={handlePayment}
                    style={{
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#AFFF4F',
                        marginTop: vwFont(20, 30),
                        paddingTop: vwFont(8, 15),
                        paddingBottom: vwFont(8, 15)
                    }}
                >
                    {reservationType === "quick" ? "빠른예약하기" : "단기예약하기"}
                </button>
            )}
        </div>
    );
};

export default Payment;
