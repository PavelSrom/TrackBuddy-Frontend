import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BottomNavigation as MUINavigation,
  BottomNavigationAction,
} from '@material-ui/core'
import { NavigationLink } from '../../types/navigation-item'
import { appNavigation } from '../../utils/navigation'

export const BottomNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<NavigationLink>('/dashboard')

  useEffect(() => {
    setCurrentPage(location.pathname as NavigationLink)
  }, [location.pathname])

  return (
    <MUINavigation
      className="w-screen fixed bottom-0 left-0 right-0 z-50 focus:border-transparent"
      value={currentPage}
      onChange={(_event, newValue) => {
        setCurrentPage(newValue)
      }}
      showLabels
    >
      {appNavigation.map(({ value, label, icon: Icon }) => (
        <BottomNavigationAction
          key={value}
          label={label}
          icon={<Icon />}
          onClick={() => navigate(value)}
        />
      ))}
    </MUINavigation>
  )
}
