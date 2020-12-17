import React from 'react'
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { Rating } from '@material-ui/lab'
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentVerySatisfied from '@material-ui/icons/SentimentVerySatisfied'
import { PageTitle } from '../styleguide/page-title'

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
      <Icon style={{ fontSize: 48 }} />
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
  tags: [],
}

export const NewJournalPage: React.FC = () => {
  const todayDate = dayjs(new Date()).format('D MMMM YYYY')

  const handleSubmit = (values: JournalFullASP): void => {
    console.log(values)
  }

  return (
    <>
      <PageTitle>Today, {todayDate}</PageTitle>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <p className="text-2xl font-semibold mt-8">How do you feel?</p>
            <Rating
              name="mood"
              onChange={(_e, newValue) => {
                // do not touch formik if invalid value
                if (newValue === null) return

                setFieldValue('mood', +newValue!)
              }}
              getLabelText={(mood: number) => moodIcons[mood].label}
              IconContainerComponent={IconContainer}
            />
            {values.mood !== null && <p>{moodIcons[values.mood].label}</p>}

            <button type="submit">submit</button>

            <p className="text-2xl font-semibold mt-8">
              What stood out during the day?
            </p>
          </Form>
        )}
      </Formik>
    </>
  )
}
