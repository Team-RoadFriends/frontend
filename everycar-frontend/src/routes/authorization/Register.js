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
    const [isDuplicatedId, setIsDuplicatedId] = useState(false); // 아이디 중복 여부
    const [isIdAvailable, setIsIdAvailable] = useState(null); // 아이디 사용 가능 여부
    const [idMessage, setIdMessage] = useState(''); // 메시지

    const [isCheckPassword, setIsCheckPassword] = useState(false); // 비밀번호 일치여부
    const [passwordMessage, setPasswordMessage] = useState(''); // 비밀번호 메시지

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 아이디 입력값이 변경되면 중복 상태 초기화
        if (name === 'userId') {
            setIsIdAvailable(null);
            setIdMessage('');
        }

        // 비밀번호 일치하는지 확인
        if (name === "confirmPassword") {
            if (formData.userPassword === '') {
                setPasswordMessage('');
                return;
            }
            checkPassword(value, name);
        }
        // 비밀번호 입력값이 변경되면 체크 상태 초기화
        if (name === "userPassword") {
            setPasswordMessage('');
        }
    };

    // 아이디 중복 검사 핸들러
    const checkDuplicateId = async () => {
        if (formData.userId.trim() === '') {
            setIdMessage("아이디를 입력해주세요.");
            return;
        }

        setIsDuplicatedId(true);
        try {
            const response = await fetch(`http://localhost:8080/api/auth/check-user-id?userId=${formData.userId}`);
            const data = await response.json();

            if (response.ok) {
                setIsIdAvailable(!data.isDuplicate);
                setIdMessage(data.isDuplicate ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.');
            } else {
                setIdMessage('서버 오류: 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('아이디 중복 검사 실패:', error);
            setIdMessage('서버 연결 실패.');
        } finally {
            setIsDuplicatedId(false);
        }
    };

    // 비밀번호 검사 핸들러
    const checkPassword = (password, name) => {
        if (name === 'confirmPassword') {
            if (password !== formData.userPassword) {
                setPasswordMessage('비밀번호가 일치하지 않습니다.');
                setIsCheckPassword(false);
            } else {
                setPasswordMessage('비밀번호가 일치합니다.');
                setIsCheckPassword(true);
            }
        }
    };

    // 회원가입 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdAvailable) {
            alert("중복된 아이디입니다. 다른 아이디를 입력해주세요.");
            return;
        }

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
                        <div className={styles.checkContainer}>
                            <h4 className={styles.subTitle}>아이디</h4>
                            <p style={{ color: isIdAvailable === false ? 'red' : 'green' }}>
                                {idMessage}
                            </p>
                        </div>
                        <div className={styles.checkDuplicateInput}>
                            <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required /><br />
                            <button type="button" onClick={checkDuplicateId} disabled={isDuplicatedId} className={styles.duplicateCheckButton}>{isDuplicatedId ? '확인 중...' : '중복 확인'}</button>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.checkContainer}>
                            <h4 className={styles.subTitle}>비밀번호</h4>
                            <p style={{ color: isCheckPassword === false ? 'red' : 'green' }}>
                                {passwordMessage}
                            </p>
                        </div>
                        <input type="password" name="userPassword" placeholder="비밀번호" onChange={handleChange} required /><br />
                        <input type="password" name="confirmPassword" placeholder="비밀번호 확인" onChange={handleChange} required /><br />
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