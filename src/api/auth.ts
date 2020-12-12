import axios from 'axios'
import { RegisterASP, LoginASP } from 'trackbuddy-shared/payloads/auth'
import { TokenASR } from 'trackbuddy-shared/responses/auth'
import { API_CONFIG } from './config'

export const refreshToken = (): Promise<TokenASR> =>
  axios.get(`${API_CONFIG.BASE_URL}/auth`).then(({ data }) => data)

export const register = (formData: RegisterASP): Promise<TokenASR> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/auth/register`, formData)
    .then(({ data }) => data)

export const login = (formData: LoginASP): Promise<TokenASR> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/auth/login`, formData)
    .then(({ data }) => data)
