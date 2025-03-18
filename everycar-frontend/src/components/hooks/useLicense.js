import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLicenseInfo } from "../../redux/userSlice";

const useLicense = () => {
    const dispatch = useDispatch();
    
    const licenseInfo = useSelector((state) => state.user.licenseInfo);
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const [loading, setLoading] = useState(true);

    // 액세스 토큰 만료 여부 확인
    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    };

    // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 받아오는 함수
    const refreshAccessToken = async () => {
        if (!refreshToken) {
            console.error('리프레시 토큰이 없습니다.');
            return null;
        }
        
        try {
            const response = await fetch('http://localhost:8080/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                return data.accessToken;
            } else {
                console.error('리프레시 토큰으로 새로운 액세스 토큰을 발급할 수 없습니다.');
                return null;
            }
        } catch (error) {
            console.error('리프레시 토큰 갱신 오류:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!token) {
            console.error('로그인이 필요합니다.');
            setLoading(false);
            return;
        }

        const fetchLicenseInfo = async () => {
            try {
                let currentToken = token;

                // 액세스 토큰이 만료되었으면 리프레시 토큰을 사용하여 새로운 액세스 토큰을 받음
                if (isTokenExpired(currentToken)) {
                    currentToken = await refreshAccessToken();
                    if (!currentToken) return; // 리프레시 토큰으로도 새로운 토큰을 발급받지 못한 경우
                }

                // 새로운 액세스 토큰으로 면허 정보 요청
                const response = await fetch('http://localhost:8080/api/license/myLicense', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                dispatch(setLicenseInfo({
                    licenseNum: data.licenseNum || '',
                    licenseDate: data.licenseDate || '',
                    licenseEndDate: data.licenseEndDate || '',
                    licensePhoto: data.licensePhoto || null,
                }));
            } catch (error) {
                console.error('면허 정보 불러오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLicenseInfo();
    }, [dispatch, token, refreshToken]);

    return { loading, licenseInfo };
};

export default useLicense;
