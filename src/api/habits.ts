import axios from 'axios'
import { HabitNewASP } from 'trackbuddy-shared/payloads/habits'
import {
  HabitOverviewASR,
  HabitFullASR,
} from 'trackbuddy-shared/responses/habits'
import { API_CONFIG } from './config'

export const getHabitsDashboard = (): Promise<HabitOverviewASR[]> =>
  axios.get(`${API_CONFIG.BASE_URL}/habits`).then(({ data }) => data)

export const getHabitById = (
  id: string
): Promise<HabitFullASR & { description: string }> =>
  axios.get(`${API_CONFIG.BASE_URL}/habits/${id}`).then(({ data }) => data)

export const createNewHabit = (formData: HabitNewASP): Promise<HabitFullASR> =>
  axios.post(`${API_CONFIG.BASE_URL}/habits`, formData).then(({ data }) => data)

export const deleteHabit = (id: string): Promise<HabitFullASR> =>
  axios.delete(`${API_CONFIG.BASE_URL}/habits/${id}`).then(({ data }) => data)

type Check = {
  id: string
  day: number
}

export const checkHabit = ({ id, day }: Check): Promise<{ message: string }> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/habits/${id}/check?day=${day}`)
    .then(({ data }) => data)

export const uncheckHabit = ({
  id,
  day,
}: Check): Promise<{ message: string }> =>
  axios
    .delete(`${API_CONFIG.BASE_URL}/habits/${id}/check?day=${day}`)
    .then(({ data }) => data)

export const toggleHabitCheck = ({
  id,
  day,
  lastCheckToday,
}: Check & { lastCheckToday: boolean }): Promise<{ message: string }> =>
  lastCheckToday ? uncheckHabit({ id, day }) : checkHabit({ id, day })

export const getHabitRepetitions = (
  id: string,
  { min, max }: { min: number; max: number }
): Promise<number[]> =>
  axios
    .get(
      `${API_CONFIG.BASE_URL}/habits/${id}/repetitions?min=${min}&max=${max}`
    )
    .then(({ data }) => data)
