import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.100:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});