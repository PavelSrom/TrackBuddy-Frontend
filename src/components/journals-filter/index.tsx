import React, { useState } from 'react'
import {
  Drawer,
  Divider,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { TextField } from '../../styleguide/text-field'

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
}

export const JournalsFilter: React.FC<Props> = ({ open, onClose }) => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [year, setYear] = useState<number>(new Date().getFullYear())

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
          <TextField noFormik select label="Month">
            {months.map((_month, index) => (
              <MenuItem key={_month} value={index}>
                {_month}
              </MenuItem>
            ))}
          </TextField>
          <TextField noFormik select label="Year">
            {years.map(_year => (
              <MenuItem key={_year} value={_year}>
                {_year}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <FormControlLabel
          control={<Checkbox checked color="primary" />}
          label="Favorite journals"
        />
      </div>

      <div className="mb-6 px-4">
        <p className="text-xl font-semibold mb-2">Sort</p>
        <TextField noFormik fullWidth select label="Sort by">
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
          <MenuItem value="mood_asc">Mood, ascending order</MenuItem>
          <MenuItem value="mood_desc">Mood, descending order</MenuItem>
        </TextField>
      </div>

      <Divider className="bg-black" />
      <div className="flex justify-between my-6 px-4">
        <Button variant="outlined" color="primary">
          Reset filters
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Apply
        </Button>
      </div>
    </Drawer>
  )
}
