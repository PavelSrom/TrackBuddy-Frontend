import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useSnackbar } from 'notistack'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { Paper, Chip, MenuItem, Button } from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { createNewJournal } from '../api/journals'
import { PageTitle } from '../styleguide/page-title'
import { TextField } from '../styleguide/text-field'
import { moodIcons } from '../utils/mood-icons'
import { ErrorResponse } from '../types/error-response'

const IconContainer: React.FC<{ value: number }> = ({ value, ...rest }) => {
  const { icon: Icon } = moodIcons[value]

  return (
    <span {...rest}>
      <Icon style={{ fontSize: 36 }} />
    </span>
  )
}

const validationSchema = Yup.object().shape({
  mood: Yup.number().min(1).max(5).required('required'),
  standout: Yup.string().required('required'),
  wentWell: Yup.string().required('required'),
  wentWrong: Yup.string().required('required'),
  betterNextTime: Yup.string().required('required'),
  excuses: Yup.string(),
  tags: Yup.array().of(Yup.string()),
})

const initialValues: JournalFullASP = {
  mood: 3,
  standout: '',
  wentWell: '',
  wentWrong: '',
  betterNextTime: '',
  excuses: '',
  tags: [],
}

export const NewJournalPage: React.FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const todayDate = dayjs(new Date()).format('D MMMM YYYY')

  const [submitEntry] = useMutation(createNewJournal, {
    onSuccess: () => {
      enqueueSnackbar('Journal entry created', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      navigate('/journals')
    },
  })

  const handleSubmit = (values: JournalFullASP): void => {
    submitEntry(values)
  }

  return (
    <>
      <PageTitle className="mb-6">{todayDate}</PageTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* mood */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">How do you feel?</p>
              <div className="flex items-center">
                <Rating
                  name="mood"
                  value={values.mood}
                  onChange={(_e, newValue) => {
                    // do not touch formik if invalid value
                    if (newValue === null) return

                    setFieldValue('mood', +newValue!)
                  }}
                  getLabelText={(mood: number) => moodIcons[mood].label}
                  IconContainerComponent={IconContainer}
                />
                <p className="text-sm ml-4">{moodIcons[values.mood].label}</p>
              </div>
            </Paper>

            {/* standout */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">
                What stood out during the day?
              </p>
              <TextField
                name="standout"
                fullWidth
                multiline
                placeholder="Type something..."
              />
            </Paper>

            {/* went well */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">What went well?</p>
              <TextField
                name="wentWell"
                fullWidth
                multiline
                placeholder="Type something..."
              />
            </Paper>

            {/* went wrong */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">What went wrong?</p>
              <TextField
                name="wentWrong"
                fullWidth
                multiline
                placeholder="Type something..."
              />
            </Paper>

            {/* better next time */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">
                What could be done better next time?
              </p>
              <TextField
                name="betterNextTime"
                fullWidth
                multiline
                placeholder="Type something..."
              />
            </Paper>

            {/* excuses */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">Any excuses you had?</p>
              <TextField
                name="excuses"
                fullWidth
                multiline
                placeholder="Type something... (optional)"
              />
            </Paper>

            {/* tags */}
            <Paper className="mb-6 p-4">
              <p className="text-xl font-semibold mb-2">
                Do you wish to add tags?
              </p>
              <TextField
                name="tags"
                fullWidth
                placeholder="Select tags... (optional)"
                select
                SelectProps={{
                  multiple: true,
                  value: values.tags,
                  renderValue(selected) {
                    return (
                      <div className="flex flex-wrap">
                        {/* @ts-ignore */}
                        {selected.map(value => (
                          <Chip
                            key={value}
                            size="small"
                            color="primary"
                            variant="outlined"
                            label={value}
                            className="m-0.5"
                          />
                        ))}
                      </div>
                    )
                  },
                }}
              >
                <MenuItem value="one">One</MenuItem>
                <MenuItem value="two">Two</MenuItem>
                <MenuItem value="three">Three</MenuItem>
                <MenuItem value="four">Four</MenuItem>
                <MenuItem value="five">Five</MenuItem>
                <MenuItem value="six">Six</MenuItem>
              </TextField>
            </Paper>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mb-6"
            >
              Submit journal
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
}
