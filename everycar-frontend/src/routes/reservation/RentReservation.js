import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import styles from '../../css/routes/RentReservation.module.scss';
import { vwFont } from "../../utils";

import CarInfo from "../../components/rentDetail/CarInfo";
import CarOption from "../../components/rentDetail/CarOption";
import RentLocation from "../../components/rentDetail/RentLocation";
import RentTime from "../../components/rentDetail/RentTime";
import ReturnLocation from "../../components/rentDetail/ReturnLocation";
import PaymentType from "../../components/rentDetail/PaymentType";
import TermsOfUse from "../../components/rentDetail/TermsOfUse";
import { useSelector } from 'react-redux';


import useCar from "../../components/hooks/useCar";

import CarNameMapper from "../../components/common/CarNameMapper";
// 부제목 스타일
let SubTitleH3 = styled.h3`
    margin-bottom: ${vwFont(10, 19)};
    font-size: ${vwFont(11, 24)};
`;

function RentReservation() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const { id } = useParams();
    const carId = Number(id);
    const reservationType = useSelector((state) => state.rent.reservationType);
    const [carData, setCarData] = useState(null);
    const [parkingList, setParkingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agree, setAgree] = useState(false);

    // 추가된 상태 값
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedParking, setSelectedParking] = useState("");
    const [returnOption, setReturnOption] = useState(0);  // 🚀 반납 옵션 상태 추가 (0: 대여한 곳, 1: 다른 곳)

    const { startDate, startTime, endDate, endTime } = useSelector((state) => state.rent);
    const { car, totalPrice } = useCar(carId);

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                let apiUrl, queryParams;

                if (reservationType === "quick") {
                    apiUrl = `${API_BASE_URL}/api/quick-rent/reservations`;
                    queryParams = new URLSearchParams({
                        rental_datetime: `${startDate}T${startTime}:00`,
                        return_datetime: `${endDate}T${endTime}:00`,
                        car_id: carId
                    }).toString();
                } else {
                    apiUrl = `${API_BASE_URL}/api/short-rent/reservations`;
                    queryParams = new URLSearchParams({
                        reservation_s_start_date: `${startDate}T${startTime}:00`,
                        reservation_s_end_date: `${endDate}T${endTime}:00`,
                        car_id: carId
                    }).toString();
                }

                const response = await fetch(`${apiUrl}?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                console.log("API 응답 데이터:", data);

                setCarData(data.carDto);
                setParkingList(data.parkingList);

                // 🚀 기본값: 대여한 곳에서 반납
                if (data.carDto?.parking) {
                    setSelectedParking(data.carDto.parking.parking_id);
                }
                setReturnOption(0);
            } catch (err) {
                console.error("API 요청 에러:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCarData();
    }, [carId]);

    const changeAgreeHandler = (e) => {
        setAgree(e.target.checked);
    };

    const handleLocationChange = (city, region, parking, option) => {
        setSelectedCity(city);
        setSelectedRegion(region);
        setReturnOption(option); // 🚀 반납 옵션 설정 (0 또는 1)
        setSelectedParking(option === 0 ? carData.parking.parking_id : parking);

        console.log("carData.parking.parking_id", carData?.parking?.parking_id);
        console.log("parking", parking);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;
    if (!carData) return <p>해당 차량 정보를 찾을 수 없습니다.</p>;

    return (
        <div className={styles.carDetail}>
            <div className={styles.mainTitle}>
                <h2>예약 및 결제</h2>
            </div>

            <div className={styles.carDetailContainer}>
                <div className={styles.left}>
                    <RentTime title="이용시간" SubTitleH3={SubTitleH3} />
                    <RentLocation
                        title="대여장소"
                        car={carData}
                        SubTitleH3={SubTitleH3}
                    />
                    {
                        (reservationType === "quick") &&
                        <ReturnLocation
                            title="반납장소"
                            SubTitleH3={SubTitleH3}
                            parkingList={parkingList}
                            onLocationChange={handleLocationChange}
                        />
                    }

                    <TermsOfUse title="이용약관" SubTitleH3={SubTitleH3} />
                    <div>
                        <label style={{ display: 'flex', gap: '10px', marginLeft: '9px' }}>
                            <input type="checkbox" checked={agree} onChange={changeAgreeHandler} />
                            <p style={{ display: 'flex', alignItems: 'center' }}>예약정보 확인 및 모든 약관 동의</p>
                        </label>
                    </div>
                    <PaymentType
                        title="결제"
                        SubTitleH3={SubTitleH3}
                        agree={agree}
                        car={carData}
                        totalPrice={totalPrice}
                        return_location={returnOption === 0 ? carData.parking.parking_id : selectedParking}
                        selectedCity={selectedCity}
                        selectedRegion={selectedRegion}
                    />
                </div>
                <div className={styles.right}>
                    <SubTitleH3>대여차량</SubTitleH3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={carData.img || `/images/main/car/${CarNameMapper(car.model.model_name)}.png`}
                            alt={carData.model.model_name}
                            style={{ width: vwFont(200, 400) }}
                        />
                    </div>
                    <div className={styles.carTitle} style={{ marginTop: vwFont(8, 18) }}>
                        <h3 style={{ fontSize: vwFont(13, 30) }}>{carData.model.model_name}</h3>
                        <div className={styles.carGrade}>{carData.car_grade}</div>
                    </div>

                    <div style={{ borderBottom: '1px solid #D9D9D9', marginTop: vwFont(10, 20), marginBottom: vwFont(10, 20) }}></div>

                    <CarInfo title="제원정보" car={carData} SubTitleH3={SubTitleH3} isHide={true} styleType="rentReservationStyle" />
                    <div style={{ marginBottom: vwFont(10, 20) }}></div>
                    <CarOption title="차량옵션" car={carData} SubTitleH3={SubTitleH3} />
                </div>
            </div>
        </div>
    );
}


export default RentReservation;
