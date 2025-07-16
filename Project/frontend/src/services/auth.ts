// src/services/auth.ts
import axios from 'axios'

interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post('/api/auth/login', { email, password })
  return response.data
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post('/api/auth/register', {
    name,
    email,
    password,
  })
  return response.data
}