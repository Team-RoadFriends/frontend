import { createSlice } from '@reduxjs/toolkit';

// JSON 파싱을 안전하게 수행하는 함수
const safeParseJSON = (item, defaultValue) => {
    try {
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing JSON from localStorage: ${error}`);
        return defaultValue;
    }
};

// localStorage에서 유저 정보 가져오기 (JSON.parse 오류 방지)
const storedUserInfo = safeParseJSON(localStorage.getItem('userInfo'), {
    userName: '',
    userId: '',
    userEmail: '',
    userPhone: '',
    userGender: '',
    userBirth: '',
    userAddress: ''
});

// localStorage에서 면허 정보 가져오기 (JSON.parse 오류 방지)
const storedLicenseInfo = safeParseJSON(localStorage.getItem('licenseInfo'), {
    licenseNum: '',
    licenseDate: '',
    licenseEndDate: '',
    licensePhoto: ''
});

// 초기 상태
const initialState = {
    isLoggedIn: !!localStorage.getItem('token'), // 로그인 여부 (토큰이 있으면 로그인된 상태로 초기화)
    userInfo: storedUserInfo, // 유저 정보
    licenseInfo: storedLicenseInfo, // 면허 정보
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload.userInfo;
            state.licenseInfo = action.payload.licenseInfo;
            
            // localStorage에 올바르게 저장
            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.setItem('licenseInfo', JSON.stringify(action.payload.licenseInfo)); 
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.userInfo = {
                userName: "",
                userId: "",
                userEmail: "",
                userPhone: "",
                userGender: "",
                userBirth: "",
                userAddress: ""
            };
            state.licenseInfo = {
                licenseNum: '',
                licenseDate: '',
                licenseEndDate: '',
                licensePhoto: null,
            };

            // localStorage에서 올바르게 삭제
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('licenseInfo'); 
        },
        setUserInfo: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload;

            // localStorage에 저장
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        setLicenseInfo: (state, action) => {
            state.licenseInfo = action.payload;

            // localStorage에 저장
            localStorage.setItem('licenseInfo', JSON.stringify(action.payload));
        },
    },
});

export const { loginUser, logoutUser, setUserInfo, setLicenseInfo } = userSlice.actions;

export default userSlice.reducer;
