import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './hoc/private-route'
// pages
import { Homepage } from './pages/home'
import { RegisterPage } from './pages/register'
import { LoginPage } from './pages/login'
import { ActionsPage } from './pages/actions'
import { DashboardPage } from './pages/dashboard'
import { NewJournalPage } from './pages/new-journal'

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <PrivateRoute path="/actions" element={<ActionsPage />} />
      <PrivateRoute path="/dashboard" element={<DashboardPage />} />
      <PrivateRoute path="/journals/new" element={<NewJournalPage />} />
    </Routes>
  )
}
