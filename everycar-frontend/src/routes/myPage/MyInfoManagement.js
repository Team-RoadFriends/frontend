import styles from '../../css/routes/myPage/MyInfoManagement.module.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 사용

const MyInfoManagement = () => {
    const [userInfo, setUserInfo] = useState(null);  // 사용자 정보
    const [licenseInfo, setLicenseInfo] = useState(null);  // 면허 정보
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const navigate = useNavigate();  // 페이지 이동 함수

    useEffect(() => {
        const token = localStorage.getItem('token');  // JWT 토큰 가져오기

        // 유저 정보 가져오기
        fetch('http://localhost:8080/api/user/mypage', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setUserInfo(data))
        .catch(error => console.error('유저 정보 불러오기 오류:', error));

        // 면허 정보 가져오기
        fetch('http://localhost:8080/api/license/myLicense', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setLicenseInfo(data))
        .catch(error => console.error('면허 정보 불러오기 오류:', error))
        .finally(() => setLoading(false));  // 데이터 가져오면 로딩 종료

    }, []);

    if (loading) {
        return <p>Loading...</p>;  // 로딩 중 표시
    }

    if (!userInfo) {
        return <p>No user info available.</p>;  // 사용자 정보 없음 표시
    }

    const handleEditClick = () => {
        navigate('/myPage/info/edit');  // 수정 페이지 이동
    };

    const handleLicenseClick = () => {
        navigate('/myPage/info/licenseCreate');
    }

    return (
        <div>
            <h1>My Page</h1>
            <div>
                <h2>내 정보</h2>
                <p><strong>User ID:</strong> {userInfo.userId}</p>
                <p><strong>User Name:</strong> {userInfo.userName}</p>
                <p><strong>Email:</strong> {userInfo.userEmail}</p>
                <p><strong>Phone:</strong> {userInfo.userPhone}</p>
                <p><strong>Gender:</strong> {userInfo.userGender === 1 ? 'Female' : 'Male'}</p>
                <p><strong>Birthdate:</strong> {userInfo.userBirth}</p>
                <p><strong>Address:</strong> {userInfo.userAddress}</p>
                <button onClick={handleEditClick}>Edit Info</button>
            </div>

            {/* 면허 정보 표시 */}
            <div>
                <h2>면허 정보</h2>
                {licenseInfo ? (
                    <>
                        <p><strong>면허 번호:</strong> {licenseInfo.licenseNum}</p>
                        <p><strong>발급일:</strong> {licenseInfo.licenseDate}</p>
                        <p><strong>만료일:</strong> {licenseInfo.licenseEndDate}</p>
                    </>
                ) : (
                    <div>
                        <p>등록된 면허 정보가 없습니다.</p>
                        <button onClick={handleLicenseClick}>면허 등록하기</button>
                    </div>
                    
                )}
            </div>
        </div>
    );
};

export default MyInfoManagement;
