import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../css/routes/authorization/Login.module.scss";

import useLogin from '../../components/hooks/useLogin';

const Login = () => {
  const navigate = useNavigate();

  const { login, errorMessage } = useLogin(); // 커스텀 훅 사용
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userId, userPassword); // 로그인 실행
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>로그인</h1>

      {errorMessage && <p style={{ color: 'red' }} className={styles.errorMessage}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.loginInput}>
          <label htmlFor="userId" className={styles.subTitle}>아 이 디: </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          /><br />
        </div>

        <div className={styles.loginInput}>
          <label htmlFor="userPassword" className={styles.subTitle}>비밀번호: </label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          /><br />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.loginButton}>로그인</button>
          <button
            className={styles.registerButton}
            onClick={() => navigate('/auth/register') }
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
