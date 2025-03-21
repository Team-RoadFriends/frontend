import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const login = async (userId, userPassword) => {
        try {
            const loginData = { userId, userPassword };

            // 1️⃣ 로그인 요청 (JWT 토큰 받기)
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('로그인 실패');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken); // 2️⃣ 토큰 저장

            console.log("✅ JWT 토큰 저장 완료:", data.accessToken);

            // 3️⃣ 토큰이 저장된 후, 0.1초 딜레이 후 유저 정보 요청
            setTimeout(async () => {
                const token = localStorage.getItem('accessToken'); // ✅ 저장된 토큰 가져오기

                console.log("🔍 저장된 JWT 토큰:", token);

                const userResponse = await fetch(`${API_BASE_URL}/api/user/mypage`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // ✅ 저장된 토큰으로 요청
                        'Content-Type': 'application/json',
                    },
                });

                const textData = await userResponse.text(); // JSON이 빈 값인지 체크
                console.log("🛠 서버 응답:", textData);

                if (!textData) {
                    throw new Error("❌ 서버에서 응답이 비어 있습니다.");
                }

                const userData = JSON.parse(textData);
                console.log("✅ 유저 정보:", userData);

                dispatch(setUserInfo(userData)); // Redux에 저장
                window.dispatchEvent(new Event('loginStateChange')); // 로그인 상태 변경 이벤트 트리거
                alert('로그인 성공!');

                // 메인페이지로 이동
                navigate('/');
            }, 100); // 0.1초 딜레이 (토큰 반영 대기)
        } catch (error) {
            console.error(error.message);
            setErrorMessage('아이디 또는 비밀번호가 틀렸습니다.');
        }
    };

    return { login, errorMessage };
};

export default useLogin;
