import axios from 'axios';

const API_URL = 'http://localhost:8080/artist';

export const createArtist = async (artistData) => {
    try {
        const response = await axios.post(`${API_URL}`, artistData, {
            headers: {Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzNCIsImF1dGgiOiJBUlRJU1QiLCJzdGF0dXMiOiJBQ1RJVkVfVVNFUiIsImV4cCI6MTcyMjQ4NjcwOCwiaWF0IjoxNzIyNDg0OTA4fQ.eUiR6QR6N5FSt46weYiLrrDw9I8ZUSgHYTFtp23JzCc"},

            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('계정 생성 중 오류가 발생했습니다.');
    }
};
