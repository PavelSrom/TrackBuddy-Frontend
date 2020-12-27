export type Filters = {
  month: number
  year: number
  favorites: boolean
  sortBy: string
}

export const initialFilters = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  favorites: false,
  sortBy: 'newest',
}
