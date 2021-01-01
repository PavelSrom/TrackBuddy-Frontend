import React, { Dispatch, SetStateAction } from 'react'
import {
  Drawer,
  Divider,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { TextField } from '../../styleguide/text-field'
import { Button } from '../../styleguide/button'
import { Filters } from '../../utils/journal-filters'

const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const years = [2020, 2021]

type Props = {
  open: boolean
  onClose: () => void
  onReset: () => void
  onApply: () => void
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  tags: string[] | undefined
}

export const JournalsFilter: React.FC<Props> = ({
  open,
  onClose,
  onReset,
  onApply,
  filters,
  setFilters,
  tags,
}) => {
  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
      PaperProps={{ className: 'rounded-b-lg pt-4' }}
    >
      <div className="mb-6 px-4">
        <p className="text-xl font-semibold mb-2">Filter</p>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            noFormik
            select
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: +e.target.value })}
            label="Month"
          >
            {months.map((_month, index) => (
              <MenuItem key={_month} value={index}>
                {_month}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            noFormik
            select
            value={filters.year}
            onChange={e => setFilters({ ...filters, year: +e.target.value })}
            label="Year"
          >
            {years.map(_year => (
              <MenuItem key={_year} value={_year}>
                {_year}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.favorites}
              onChange={(_e, checked) =>
                setFilters({ ...filters, favorites: checked })
              }
              color="primary"
            />
          }
          label="Favorite journals"
        />
      </div>

      <div className="mb-6 px-4">
        <p className="text-xl font-semibold mb-2">Sort</p>
        <TextField
          noFormik
          fullWidth
          select
          value={filters.sortBy}
          onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
          label="Sort by"
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
          <MenuItem value="mood_asc">Mood, ascending order</MenuItem>
          <MenuItem value="mood_desc">Mood, descending order</MenuItem>
        </TextField>
      </div>

      <Divider className="bg-black" />
      <div className="flex justify-between my-6 px-4">
        <Button variant="outlined" color="primary" onClick={onReset}>
          Reset filters
        </Button>
        <Button variant="contained" color="secondary" onClick={onApply}>
          Apply
        </Button>
      </div>
    </Drawer>
  )
}
