export type Filters = {
  month: number
  year: number
  favorites: boolean | null
  sortBy: string
  tag: string
}

export const initialFilters: Filters = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  favorites: null,
  sortBy: 'newest',
  tag: '',
}
