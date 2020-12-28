export type Filters = {
  month: number
  year: number
  favorites: boolean | null
  sortBy: string
}

export const initialFilters = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  favorites: null,
  sortBy: 'newest',
}
