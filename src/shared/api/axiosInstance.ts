import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
})
