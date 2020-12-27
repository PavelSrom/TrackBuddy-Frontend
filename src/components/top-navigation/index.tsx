import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
} from '@material-ui/core'
import Menu from '@material-ui/icons/Menu'
import { appNavigation } from '../../utils/navigation'
import { useAuth } from '../../contexts/auth'

const pageLabels: { url: string; label: string }[] = [
  {
    url: '/dashboard',
    label: 'Dashboard',
  },
  {
    url: '/journals',
    label: 'Journals',
  },
  {
    url: '/journals/new',
    label: 'New journal',
  },
  {
    url: '/habits',
    label: 'Habits',
  },
  {
    url: '/planner',
    label: 'Planner',
  },
]

export const TopNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logoutUser } = useAuth()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const pageLabel = pageLabels.find(item => item.url === location.pathname)

  useEffect(() => {
    setCurrentPage(
      appNavigation.findIndex(item => item.value === location.pathname)
    )
  }, [location.pathname])

  return (
    <>
      <AppBar position="fixed" className="mb-12">
        <Toolbar variant="dense" className="flex justify-between items-center">
          <div className="flex items-center text-white">
            <IconButton edge="start" onClick={() => setDrawerOpen(true)}>
              <Menu className="text-white" />
            </IconButton>
            {pageLabel && (
              <p className="text-xl font-semibold ml-4">{pageLabel?.label}</p>
            )}
          </div>
          <Typography
            variant="button"
            className="text-white"
            onClick={logoutUser}
          >
            Logout
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="left"
        classes={{ paper: 'w-60 p-4' }}
      >
        <p className="text-2xl uppercase mb-8">Menu</p>
        <List component="nav" dense>
          {appNavigation.map(({ value, label, icon: Icon }, index) => (
            <ListItem button key={value} className="pl-0">
              <div
                className={clsx('flex items-center py-2', {
                  ['text-blue-400']: index !== currentPage,
                  ['text-red-400']: index === currentPage,
                })}
              >
                <ListItemIcon
                  className={clsx({
                    ['text-blue-400']: index !== currentPage,
                    ['text-red-400']: index === currentPage,
                  })}
                >
                  <Icon className="text-2xl" />
                </ListItemIcon>
                <Typography
                  variant="button"
                  onClick={() => {
                    setDrawerOpen(false)
                    navigate(value)
                  }}
                >
                  {label}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
