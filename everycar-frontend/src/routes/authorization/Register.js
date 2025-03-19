import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../css/routes/authorization/Register.module.scss";

const Register = () => {
    const [formData, setFormData] = useState({
        userId: '',
        userPassword: '',
        userName: '',
        userEmail: '',
        userPhone: '',
        userGender: 1, // 기본값: 여성
        userBirth: '',
        userAddress: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('회원가입 성공! 로그인 페이지로 이동합니다.');
                navigate('/auth/login');
            } else {
                alert('회원가입 실패! 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
        }
    };

    return (
        <div className={styles.register}>
            <div className={styles.registerBackground}>
                <h2 className={styles.title}>회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>아이디</h4>
                        <input type="text" name="userId" placeholder="아이디" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>비밀번호</h4>
                        <input type="password" name="userPassword" placeholder="비밀번호" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>이름</h4>
                        <input type="text" name="userName" placeholder="이름" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>성별</h4>
                        <label>
                            <input type="radio" name="userGender" value={1} checked={formData.userGender == 1} onChange={handleChange} /> 여성
                            <input type="radio" name="userGender" value={2} checked={formData.userGender == 2} onChange={handleChange} /> 남성
                        </label>
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>이메일</h4>
                        <input type="email" name="userEmail" placeholder="이메일" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>전화번호</h4>
                        <input type="text" name="userPhone" placeholder="전화번호" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>생년월일</h4>
                        <input type="date" name="userBirth" onChange={handleChange} required /><br />
                    </div>
                    <div className={styles.inputContainer}>
                        <h4 className={styles.subTitle}>주소</h4>
                        <input type="text" name="userAddress" placeholder="주소" onChange={handleChange} required /><br />
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.registerButton}>회원가입</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;