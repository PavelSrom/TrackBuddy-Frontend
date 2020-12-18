import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BottomNavigation as MUINavigation,
  BottomNavigationAction,
} from '@material-ui/core'
import { appNavigation } from '../../utils/navigation'

export const BottomNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  useEffect(() => {
    setCurrentPage(
      appNavigation.findIndex(item => item.value === location.pathname)
    )
  }, [location.pathname])

  return (
    <MUINavigation
      className="w-screen fixed bottom-0 left-0 right-0 z-50"
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
