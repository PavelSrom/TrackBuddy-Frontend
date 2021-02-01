import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './hoc/private-route'
// pages
import { Homepage } from './pages/home'
import { RegisterPage } from './pages/register'
import { LoginPage } from './pages/login'
import { ForgotPasswordPage } from './pages/forgot-password'
import { ActionsPage } from './pages/actions'
import { DashboardPage } from './pages/dashboard'
import { NewJournalPage } from './pages/new-journal'
import { JournalsPage } from './pages/journals'
import { PlannerPage } from './pages/planner'
import { HabitsPage } from './pages/habits'
import { ChartsPage } from './pages/charts'
import { ViewJournalPage } from './pages/view-journal'
import { ViewHabit } from './pages/view-habit'

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password-reset" element={<ForgotPasswordPage />} />
      <PrivateRoute path="/actions" element={<ActionsPage />} />
      <PrivateRoute path="/dashboard" element={<DashboardPage />} />
      <PrivateRoute path="/habits" element={<HabitsPage />} />
      <PrivateRoute path="/habits/:id" element={<ViewHabit />} />
      <PrivateRoute path="/charts" element={<ChartsPage />} />
      <PrivateRoute path="/journals" element={<JournalsPage />} />
      <PrivateRoute path="/planner" element={<PlannerPage />} />
      <PrivateRoute path="/journals/new" element={<NewJournalPage />} />
      <PrivateRoute path="/journals/:id" element={<ViewJournalPage />} />
    </Routes>
  )
}
