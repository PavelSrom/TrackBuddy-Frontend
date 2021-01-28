import React from 'react'
import clsx from 'clsx'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@material-ui/core'
import { HabitNewASP } from 'trackbuddy-shared/payloads/habits'
import { Button } from '../../styleguide/button'
import { TextField } from '../../styleguide/text-field'
import { HabitColor } from '../../utils/funcs'

const initialValues: HabitNewASP & { description: string } = {
  name: '',
  color: '',
  duration: 10,
  frequency: 1,
  description: '',
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  color: Yup.string().required('required'),
  duration: Yup.number().required('required'),
  frequency: Yup.number().required('required'),
})

const colorOptions: { label: HabitColor; color: string }[] = [
  {
    label: 'red',
    color: 'bg-red-500',
  },
  {
    label: 'yellow',
    color: 'bg-yellow-500',
  },
  {
    label: 'green',
    color: 'bg-green-500',
  },
  {
    label: 'blue',
    color: 'bg-blue-500',
  },
  {
    label: 'black',
    color: 'bg-black',
  },
]

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: HabitNewASP) => void
  loading: boolean
  colorsTaken: HabitColor[]
}

export const NewHabitDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  loading,
  colorsTaken,
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
      classes={{ paper: 'h-full' }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col h-full">
            <DialogTitle>Create new habit</DialogTitle>
            <DialogContent dividers classes={{ root: 'flex-1' }}>
              <TextField name="name" label="Name" fullWidth />
              <TextField
                name="color"
                label="Color"
                fullWidth
                select
                SelectProps={{ classes: { root: 'flex' } }}
              >
                {colorOptions.map(({ label, color }) => (
                  <MenuItem
                    key={label}
                    value={label}
                    className="flex items-center"
                    disabled={colorsTaken.some(col => col === label)}
                  >
                    <div className={clsx('w-5 h-5 rounded-full mr-4', color)} />
                    <p>{label.toUpperCase()}</p>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="duration"
                label="Duration in minutes"
                fullWidth
                onChange={e => setFieldValue('duration', +e.target.value)}
              />
              <TextField name="frequency" label="Frequency" fullWidth select>
                <MenuItem value={1}>Once a day</MenuItem>
                <MenuItem value={2}>Every other day</MenuItem>
                <MenuItem value={3.5}>Twice a week</MenuItem>
                <MenuItem value={7}>Once a week</MenuItem>
              </TextField>
              <TextField
                name="description"
                label="Description (optional)"
                fullWidth
                multiline
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                loading={loading}
                type="submit"
                variant="contained"
                color="secondary"
              >
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
