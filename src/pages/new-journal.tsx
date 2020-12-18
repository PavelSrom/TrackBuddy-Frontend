import React from 'react'
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { Paper, Chip, MenuItem, Button } from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentVerySatisfied from '@material-ui/icons/SentimentVerySatisfied'
import { PageTitle } from '../styleguide/page-title'
import { TextField } from '../styleguide/text-field'

const moodIcons: Record<number, { icon: React.ElementType; label: string }> = {
  1: {
    icon: SentimentVeryDissatisfied,
    label: 'Awful',
  },
  2: {
    icon: SentimentDissatisfied,
    label: 'Bad',
  },
  3: {
    icon: SentimentSatisfied,
    label: 'Okay',
  },
  4: {
    icon: SentimentSatisfiedAlt,
    label: 'Good',
  },
  5: {
    icon: SentimentVerySatisfied,
    label: 'Great',
  },
}

const IconContainer: React.FC<{ value: number }> = ({ value, ...rest }) => {
  const { icon: Icon } = moodIcons[value]

  return (
    <span {...rest}>
      <Icon style={{ fontSize: 36 }} />
    </span>
  )
}

const initialValues: JournalFullASP = {
  mood: 3,
  standout: '',
  wentWell: '',
  wentWrong: '',
  betterNextTime: '',
  excuses: '',
  tags: ['one', 'two'],
}

export const NewJournalPage: React.FC = () => {
  const todayDate = dayjs(new Date()).format('D MMMM YYYY')

  const handleSubmit = (values: JournalFullASP): void => {
    // eslint-disable-next-line
    console.log(values)
  }

  return (
    <>
      <PageTitle>Today, {todayDate}</PageTitle>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                noHelperTextGap
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
                noHelperTextGap
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
                noHelperTextGap
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
                noHelperTextGap
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
                noHelperTextGap
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
