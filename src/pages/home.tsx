import React from 'react'
import { useNavigate } from 'react-router-dom'
import TrackChanges from '@material-ui/icons/TrackChanges'
import { Button } from '../styleguide/button'

export const Homepage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className="bg-gray-700 min-h-screen flex flex-col justify-center px-4 text-white">
        <div className="flex justify-center items-center">
          <TrackChanges className="text-7xl mr-4" />
          <p className="text-4xl">TrackBuddy</p>
        </div>
        <p className="text-lg mt-4 text-center">
          The unique app that helps you get your life in check
        </p>
        <div className="flex justify-around items-center text-blue-400 mt-20">
          <Button variant="contained" onClick={() => navigate('/register')}>
            Sign up
          </Button>
          <Button onClick={() => navigate('/login')}>Sign in</Button>
        </div>
      </header>

      <section className="bg-white px-4 py-8 text-gray-600 text-center mb-4">
        <img src="/images/journal.png" alt="" className="max-w-full h-auto" />
        <p className="text-2xl font-semibold mb-2">Pause and reflect</p>
        <p>
          We all live busy lives, but sometimes it is necessary to take a step
          back and reflect.
        </p>
        <p className="mt-2">
          Write short, daily reflections, keep them organized and accessible at
          any time.
        </p>
      </section>

      <section className="bg-white px-4 py-8 text-gray-600 text-center mb-4">
        <img src="/images/habits.png" alt="" className="max-w-full h-auto" />
        <p className="text-2xl font-semibold mb-2">Develop better habits</p>
        <p>
          Create habit routines that will take you only a few minutes to
          complete, get reminders, and see your habit score.
        </p>
      </section>

      <section className="bg-white px-4 py-8 text-gray-600 text-center">
        <img
          src="/images/bucket_list.png"
          alt=""
          className="max-w-full h-auto"
        />
        <p className="text-2xl font-semibold mb-2">Create actionable steps</p>
        <p>
          Ever struggled with reaching your goals? Break them down into tiny
          pieces and create a daily routine towards achieving them.
        </p>
      </section>

      <section className="bg-white px-4 py-8 text-gray-600 text-center">
        <img
          src="/images/visual_data.png"
          alt=""
          className="max-w-full h-auto"
        />
        <p className="text-2xl font-semibold mb-2">See your progress</p>
        <p>
          Watch yourself getting better and track the progress you are making
          through a wide variety of interactive graphs.
        </p>
      </section>

      <footer className="bg-gray-700 text-center py-2">
        <p className="text-white">Footer text coming</p>
      </footer>
    </>
  )
}
