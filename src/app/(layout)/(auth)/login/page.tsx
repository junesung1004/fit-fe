'use client';

import React from 'react';

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>로그인</h1>

      <input type="text" placeholder="이메일 또는 아이디" style={styles.input} />
      <input type="password" placeholder="비밀번호" style={styles.input} />

      <button style={styles.loginBtn}>로그인</button>

      <div style={styles.links}>
        <a href="/signup">회원가입</a>
        <span style={styles.linkDivider}>|</span>
        <a href="/find-id">아이디 찾기</a>
        <span style={styles.linkDivider}>|</span>
        <a href="/find-password">비밀번호 찾기</a>
      </div>

      <div style={styles.divider}>또는</div>

      {/* 네이버 로그인*/}
      <button style={styles.naverBtn}>
        <img src="/naver-logo.png" style={styles.naverIcon}  />
        
      </button>

      {/* 카카오 로그인 버튼 (PNG 이미지 사용) */}
      <button style={styles.kakaoBtn}>
        <img src="/kakao-logo.png"  style={styles.kakaoIcon} />
      </button>
      <button style={{ ...styles.socialBtn, backgroundColor: '#fff', color: '#000', border: '1px solid #ccc' }}>
        구글 로그인
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 400,
    margin: '100px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 10,
    textAlign: 'center',
    
  },
  title: {
    marginBottom: 20,
  },
  input: {
    display: 'block',
    width: '100%',
    marginBottom: 10,
    padding: 16,
    fontSize: 12,
    border: '1px solid #F43F5E', // ✅ 빨간 테두리
    borderRadius: 5,
  },
  loginBtn: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor:'#F43F5E',
    color: 'white',
    border: 'none',
    borderRadius: 5,
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px', // ✅ 링크 간격 확보
    marginBottom: 20,
    fontSize: 14,
    flexWrap: 'wrap', // ✅ 줄바꿈 가능
     color: '#aaa',
  },
  linkDivider: {
    color: '#aaa',
  },
  divider: {
    margin: '20px 0',
    fontSize: 14,
    color: '#888',
  },
  socialBtn: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  // styles 객체에 추가 및 수정
naverBtn: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#03C75A', // 네이버 그린
  border: 'none',
  borderRadius: 6,
  padding: '12px 16px',
  width: '100%',
  cursor: 'pointer',
  marginBottom: 13,
},
naverIcon: {
  height: 35,
  objectFit: 'contain',
},


  // 카카오 버튼 스타일 추가
  kakaoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500', // 배경색
    border: 'none',
    borderRadius: 6,
    padding: '6px 16px',
    width: '100%',
    cursor: 'pointer',
    marginBottom: 10,
  },
  kakaoIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#000000', // 심볼 색상
  },
  kakaoLabel: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.85)', // 레이블 색상
    fontWeight: 500,
  },
};
