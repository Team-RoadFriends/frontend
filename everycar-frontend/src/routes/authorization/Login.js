import React, { useState } from 'react';

const Login = () => {
    const [userId, setUserId] = useState('');          // 사용자 아이디 상태
    const [userPassword, setUserPassword] = useState('');  // 사용자 비밀번호 상태
    const [errorMessage, setErrorMessage] = useState('');  // 에러 메시지 상태

    // 폼 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();  // 페이지 새로고침 방지

        const loginData = {
            userId,
            userPassword
        };

        // 로그인 API 호출
        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('로그인 실패');
            }
            return response.json();
        })
        .then(data => {
            // 로그인 성공 시 JWT 토큰 저장
            localStorage.setItem('token', data.token);  // 서버에서 반환한 토큰을 localStorage에 저장
            alert('로그인 성공!');
            window.location.href = '/mypage';  // 예: 마이페이지로 리디렉션
        })
        .catch(error => {
            console.error('로그인 실패:', error);
            setErrorMessage('아이디 또는 비밀번호가 틀렸습니다.');
        });
    };

    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userId">아이디:</label>
                <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}  // 입력값 상태 업데이트
                    required
                /><br />

                <label htmlFor="userPassword">비밀번호:</label>
                <input
                    type="password"
                    id="userPassword"
                    name="userPassword"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}  // 입력값 상태 업데이트
                    required
                /><br />

                <button type="submit">로그인</button>
            </form>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* 에러 메시지 출력 */}
        </div>
    );
};

export default Login;
