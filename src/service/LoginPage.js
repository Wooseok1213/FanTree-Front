import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const login = async (id, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { id, password });

    if (response.status === 200) { // 상태 코드를 체크하도록 수정
      const accessToken = response.headers['authorization']; // 헤더를 올바르게 읽어오기
      const refresjToken = response.headers['refresh_token'];

      window.localStorage.setItem('accessToken', accessToken);
      window.localStorage.setItem('refreshToken', refresjToken);
      return response.data;
    } else {
      throw new Error(response.data.message || '로그인 실패');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


// 소셜 로그인을 위한 추가 함수들
export const kakaoLogin = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/kakao`, { token });
    // 응답 처리
    return response.data;
  } catch (error) {
    console.error('Kakao login error:', error);
    throw error;
  }
};