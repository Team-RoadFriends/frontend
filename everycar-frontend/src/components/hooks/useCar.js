import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useCar = (carId) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { startDate, startTime, endDate, endTime } = useSelector((state) => state.rent);
  const reservationType = useSelector((state) => state.rent.reservationType);

  const [car, setCar] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarInfo = async () => {
      if (!carId || carId <= 0) {
        setLoading(false);
        return;
      }

      try {
        let queryParams = new URLSearchParams();

        // 날짜 값이 없으면 기본값 설정
        const rentalDatetime = startDate ? `${startDate}T${startTime || "10:00"}:00` : "2025-01-01T10:00:00";
        const returnDatetime = endDate ? `${endDate}T${endTime || "10:00"}:00` : "2025-01-02T10:00:00";

        if (reservationType === "quick") {
          queryParams.append("rental_datetime", rentalDatetime);
          queryParams.append("return_datetime", returnDatetime);
        } else {
          queryParams.append("reservation_s_start_date", rentalDatetime);
          queryParams.append("reservation_s_end_date", returnDatetime);
        }

        const token = localStorage.getItem("accessToken"); // JWT 토큰 가져오기
        // 예약 타입에 따라 다른 API 엔드포인트 사용
        const apiUrl = reservationType === "quick"
          ? `${API_BASE_URL}/api/quick-rent/cars/${carId}?${queryParams}`
          : `${API_BASE_URL}/api/short-rent/cars/${carId}?${queryParams}`;

        // console.log("API 호출 URL:", apiUrl); // 디버깅용

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Failed to fetch car info. Status: ${res.status}`);
        }

        const data = await res.json();
        // console.log("API 응답 데이터:", data); // 디버깅용

        if (!data || !data.car) {
          throw new Error("🚨 데이터가 없습니다. (해당 차량을 찾을 수 없음)");
        }

        setCar(data.car || null);
        setTotalPrice(data.totalPrice || 0);
      } catch (error) {
        console.error("API 요청 실패:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarInfo();
  }, [carId, reservationType, startDate, startTime, endDate, endTime]);

  return { car, totalPrice, loading, error };
};

export default useCar;
