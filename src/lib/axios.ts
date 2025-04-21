import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.fit-date.co.kr/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default instance;
