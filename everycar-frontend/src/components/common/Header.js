import { Link } from 'react-router-dom';
import styled from 'styled-components';

import '../../css/common/Header.css';

// Link 태그 스타일 컴포넌트
const MenuLinkStyle = styled(Link)`
  color: black;
  text-decoration: none;
`;

function Header() {
  const token = localStorage.getItem('token');  // JWT 토큰 확인
  const isLoggedIn = token !== null;  // 토큰이 있으면 로그인한 상태

  const handleLogout = () => {
    localStorage.removeItem('token');  // 로그아웃 시 토큰 삭제
    window.location.reload();  // 페이지 새로 고침
  };

  return (
    <div className="header">
      {/* 상단 메뉴 링크 */}
      <nav className='menu'>
        <div className='menu-container'>
          <div className='left-center-group'>
            <div className='left-menu'>
              <MenuLinkStyle to='/'>
                <img src='/logo.png' style={{ width: '138px', height: '50px' }} />
              </MenuLinkStyle>
            </div>
            <div className='center-menu'>
              <MenuLinkStyle to='/reservation/quickReservation'>빠른예약</MenuLinkStyle>
              <MenuLinkStyle to='/reservation/shortRent'>단기렌트</MenuLinkStyle>
              <MenuLinkStyle to='/support/announcement'>공지사항</MenuLinkStyle>
              <MenuLinkStyle to='/support/event'>이벤트</MenuLinkStyle>
              <MenuLinkStyle to='/support/inquiry'>문의하기</MenuLinkStyle>
            </div>
          </div>

          <div className='right-menu'>
            {isLoggedIn ? (
              <>
                {/* 로그인한 경우 */}
                <MenuLinkStyle to='/myPage/info'>내 정보</MenuLinkStyle>
                <MenuLinkStyle to='/myPage/history'>예약 내역</MenuLinkStyle>
                <MenuLinkStyle to='/auth/login' onClick={handleLogout} className='login'>로그아웃</MenuLinkStyle>
              </>
            ) : (
              <>
                {/* 로그인하지 않은 경우 */}
                <MenuLinkStyle to='/auth/login' className='login'>로그인</MenuLinkStyle>
                <MenuLinkStyle to='/auth/register' className='register'>회원가입</MenuLinkStyle>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
