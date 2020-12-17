import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Slide } from '@material-ui/core'
import { actions } from '../utils/actions'
import { PageTitle } from '../styleguide/page-title'

export const ActionsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <PageTitle>I want to...</PageTitle>

      {actions.map(({ label, url, enabled, icon: Icon, gradient }, index) => (
        <Slide key={url} direction="right" in timeout={(index + 1) * 250}>
          <Paper
            onClick={() => (enabled ? navigate(url) : null)}
            className="p-4 mt-6 w-full flex justify-between items-center text-white"
            style={{ background: gradient, opacity: enabled ? 1 : 0.5 }}
          >
            <p className="text-xl font-semibold">{label}</p>
            <Icon />
          </Paper>
        </Slide>
      ))}
    </>
  )
}
