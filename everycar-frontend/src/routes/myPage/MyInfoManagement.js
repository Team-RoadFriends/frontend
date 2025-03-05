import styles from '../../css/routes/myPage/MyInfoManagement.module.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate로 변경

const MyInfoManagement = () => {
    const [userInfo, setUserInfo] = useState(null);  // 사용자 정보를 저장할 state
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const navigate = useNavigate();  // useNavigate 사용

    useEffect(() => {
        const token = localStorage.getItem('token');  // 로컬스토리지에서 JWT 토큰 가져오기

        fetch('http://localhost:8080/api/user/mypage', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserInfo(data);  // 받은 데이터로 상태 업데이트
            setLoading(false);   // 로딩 끝
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            setLoading(false);
        });
    }, []);  // 컴포넌트가 처음 렌더링될 때만 실행

    if (loading) {
        return <p>Loading...</p>;  // 로딩 중일 때 화면에 표시
    }

    if (!userInfo) {
        return <p>No user info available.</p>;  // 사용자 정보가 없으면 표시
    }

    const handleEditClick = () => {
        // 수정 페이지로 이동
        navigate('/myPage/info/edit');  // history.push -> navigate
    };

    return (
        <div>
            <h1>My Page</h1>
            <div>
                <p>User ID: {userInfo.userId}</p>
                <p>User Name: {userInfo.userName}</p>
                <p>Email: {userInfo.userEmail}</p>
                <p>Phone: {userInfo.userPhone}</p>
                <p>Gender: {userInfo.userGender === 1 ? 'Female' : 'Male'}</p>
                <p>Birthdate: {userInfo.userBirth}</p>
                <p>Address: {userInfo.userAddress}</p>
                <button onClick={handleEditClick}>Edit Info</button>  {/* 수정 버튼 추가 */}
            </div>
        </div>
    );
};

export default MyInfoManagement;
