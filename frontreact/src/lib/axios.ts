import axios from 'axios';

const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'; // 스프링 포트에 맞게

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error('[API ERROR]', err.response.status, err.response.data);
    } else {
      console.error('[API ERROR]', err.message);
    }
    return Promise.reject(err);
  }
);
