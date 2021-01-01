import React from 'react'
import { Form, useFormikContext } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { Rating } from '@material-ui/lab'
import { Paper, Chip, MenuItem } from '@material-ui/core'
import { TextField } from '../../styleguide/text-field'
import { Button } from '../../styleguide/button'
import { moodIcons } from '../../utils/mood-icons'

const IconContainer: React.FC<{ value: number }> = ({ value, ...rest }) => {
  const { icon: Icon } = moodIcons[value]

  return (
    <span {...rest}>
      <Icon style={{ fontSize: 36 }} />
    </span>
  )
}

type Props = {
  loading: boolean
  tags?: string[] // TODO: pass tags as props once implemented
}

export const JournalEntryForm: React.FC<Props> = ({ loading }) => {
  const { values, setFieldValue } = useFormikContext<JournalFullASP>()

  return (
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
        <p className="text-xl font-semibold mb-2">Do you wish to add tags?</p>
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
        loading={loading}
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className="mb-6"
      >
        Submit journal
      </Button>
    </Form>
  )
}
