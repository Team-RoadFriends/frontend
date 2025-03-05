import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyInfoEdit = () => {
    const navigate = useNavigate();  // useNavigate 훅 사용
    const [userInfo, setUserInfo] = useState({
        userId: '',
        userName: '',
        userEmail: '',
        userPhone: '',
        userAddress: '',
        userGender: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/user/mypage', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserInfo({
                userId: data.userId,  // userId 추가
                userName: data.userName,  // userName 추가
                userEmail: data.userEmail,
                userPhone: data.userPhone,
                userAddress: data.userAddress,
                userGender: data.userGender
            });
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/user/mypage', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => response.text())  // text()로 처리
        .then((message) => {
            alert(message);  // 텍스트 메시지 알림
            // 수정 완료 후 myPage/info로 이동
            navigate('/myPage/info');
        })
        .catch(error => {
            console.error('Error updating user info:', error);
        });
    };

    return (
        <div>
            <h1>내 정보 수정</h1>
            <form onSubmit={handleSubmit}>
                {/* 수정할 수 없지만 보여줄 수 있는 부분 */}
                <div>
                    <label>User ID:</label>
                    <p>{userInfo.userId}</p>  {/* 사용자 ID 표시 */}
                </div>
                <div>
                    <label>User Name:</label>
                    <p>{userInfo.userName}</p>  {/* 사용자 이름 표시 */}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={userInfo.userEmail}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="userPhone"
                        value={userInfo.userPhone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="userAddress"
                        value={userInfo.userAddress}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default MyInfoEdit;
