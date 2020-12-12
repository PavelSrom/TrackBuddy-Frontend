import React from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles, Theme, Typography, Paper, Slide } from '@material-ui/core'
import { actions } from '../utils/actions'
import { PageTitle } from '../styleguide/page-title'

const useStyles = makeStyles<Theme>(theme => ({
  paper: {
    padding: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
  },
}))

export const ActionsPage: React.FC = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  return (
    <>
      <PageTitle>I want to...</PageTitle>

      {actions.map(({ label, url, enabled, icon: Icon, gradient }, index) => (
        <Slide key={url} direction="right" in timeout={(index + 1) * 250}>
          <Paper
            onClick={() => (enabled ? navigate(url) : null)}
            className={classes.paper}
            style={{ background: gradient, opacity: enabled ? 1 : 0.5 }}
          >
            <Typography variant="h6">{label}</Typography>
            <Icon />
          </Paper>
        </Slide>
      ))}
    </>
  )
}
