import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Fab } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { getHabitsDashboard } from '../api/habits'

export const HabitsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const { data } = useQuery('habitsDashboard', getHabitsDashboard)
  console.log(data)

  return (
    <>
      <p>Habits page</p>

      <Fab
        disabled={data ? data.length > 5 : false}
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => setDialogOpen(true)}
      >
        <Add className="text-white" />
      </Fab>
    </>
  )
}
