import axios from 'axios'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import {
  JournalFullASR,
  JournalBriefASR,
} from 'trackbuddy-shared/responses/journals'
import { API_CONFIG } from './config'

export const getAllJournals = (): Promise<JournalBriefASR[]> =>
  axios.get(`${API_CONFIG.BASE_URL}/journals`).then(({ data }) => data)

export const getJournalById = (
  _: string,
  id: string
): Promise<JournalFullASR> =>
  axios.get(`${API_CONFIG.BASE_URL}/journals/${id}`).then(({ data }) => data)

export const createNewJournal = (
  formData: JournalFullASP
): Promise<JournalFullASR> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/journals`, formData)
    .then(({ data }) => data)
