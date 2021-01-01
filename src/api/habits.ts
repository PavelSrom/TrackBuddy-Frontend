import axios from 'axios'
import { HabitNewASP } from 'trackbuddy-shared/payloads/habits'
import {
  HabitOverviewASR,
  HabitFullASR,
} from 'trackbuddy-shared/responses/habits'
import { API_CONFIG } from './config'

export const getHabitsDashboard = (): Promise<HabitOverviewASR[]> =>
  axios.get(`${API_CONFIG.BASE_URL}/habits`).then(({ data }) => data)

export const getHabitById = (_key: string, id: string): Promise<HabitFullASR> =>
  axios.get(`${API_CONFIG.BASE_URL}/journals/${id}`).then(({ data }) => data)

export const createNewHabit = (formData: HabitNewASP): Promise<HabitFullASR> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/journals`, formData)
    .then(({ data }) => data)

export const deleteHabit = (id: string): Promise<HabitFullASR> =>
  axios.delete(`${API_CONFIG.BASE_URL}/habits/${id}`).then(({ data }) => data)

export const getHabitRepetitions = (
  _key: string,
  id: string,
  { min, max }: { min: string; max: string }
): Promise<number[]> =>
  axios
    .get(
      `${API_CONFIG.BASE_URL}/habits/${id}/repetitions?min=${min}&max=${max}`
    )
    .then(({ data }) => data)
