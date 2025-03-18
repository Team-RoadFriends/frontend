const API_URL = 'http://localhost:8080/api';

// 액세스 토큰 만료 여부를 확인하는 함수
const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

// 리프레시 토큰으로 액세스 토큰을 갱신하는 함수
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.error('리프레시 토큰이 없습니다.');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/refresh`, {
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

// API 요청을 처리하는 함수
const ApiClient = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    // 액세스 토큰이 만료된 경우, 리프레시 토큰을 사용해 새 액세스 토큰을 갱신
    if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
            throw new Error('새로운 액세스 토큰을 받을 수 없습니다.');
        }
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.statusText}`);
    }

    return response.json();
};

export default ApiClient;
