/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { API_CONFIG } from './config'

// TODO: add response types

export const getFullProfile = (): Promise<any> =>
  axios.get(`${API_CONFIG.BASE_URL}/profile`).then(({ data }) => data)

export const updateProfile = (formData: { tags: string[] }): Promise<any> =>
  axios.put(`${API_CONFIG.BASE_URL}/profile`, formData).then(({ data }) => data)

export const getUsersTags = (): Promise<any> =>
  axios.get(`${API_CONFIG.BASE_URL}/profile/tags`).then(({ data }) => data)
