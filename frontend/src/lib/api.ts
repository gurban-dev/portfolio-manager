import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  /* withCredentials: true ensures that session cookies
     are sent to Django with every request. */
  withCredentials: true,
})