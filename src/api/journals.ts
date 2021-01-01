import axios from 'axios'
import queryString from 'query-string'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import {
  JournalFullASR,
  JournalBriefASR,
} from 'trackbuddy-shared/responses/journals'
import { Filters } from '../utils/journal-filters'
import { API_CONFIG } from './config'

export const getAllJournals = (
  _: string,
  filters: Filters
): Promise<JournalBriefASR[]> => {
  const query = queryString.stringify(filters, { skipNull: true })

  return axios
    .get(`${API_CONFIG.BASE_URL}/journals?${query}`)
    .then(({ data }) => data)
}

export const journalMadeToday = (): Promise<{ found: boolean }> =>
  axios.get(`${API_CONFIG.BASE_URL}/journals/today`).then(({ data }) => data)

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

export const updateJournal = ({
  id,
  formData,
}: {
  id: string
  formData: JournalFullASP
}): Promise<JournalFullASR> =>
  axios
    .put(`${API_CONFIG.BASE_URL}/journals/${id}`, formData)
    .then(({ data }) => data)

export const addJournalToStarred = (id: string): Promise<JournalFullASR> =>
  axios
    .post(`${API_CONFIG.BASE_URL}/journals/favorite/${id}`)
    .then(({ data }) => data)

export const removeJournalFromStarred = (id: string): Promise<JournalFullASR> =>
  axios
    .delete(`${API_CONFIG.BASE_URL}/journals/favorite/${id}`)
    .then(({ data }) => data)

export const toggleJournalIsStarred = ({
  id,
  isStarred,
}: {
  id: string
  isStarred: boolean
}): Promise<JournalFullASR> =>
  isStarred ? removeJournalFromStarred(id) : addJournalToStarred(id)

export const undoJournalEntry = (id: string): Promise<JournalFullASR> =>
  axios.delete(`${API_CONFIG.BASE_URL}/journals/${id}`).then(({ data }) => data)
