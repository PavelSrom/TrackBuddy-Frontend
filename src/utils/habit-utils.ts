import { HabitOverviewASR } from 'trackbuddy-shared/responses/habits'
import { startOfDay, differenceInDays } from 'date-fns'

export const habitFrequency: Record<number, string> = {
  1: 'Once a day',
  2: 'Every other day',
  3.5: 'Twice a week',
  7: 'Once a week',
}

export const saveHabitsToStorage = (habits: HabitOverviewASR[]): void => {
  const habitsToDoToday = habits?.filter(habit => {
    const lastRepDate = startOfDay(new Date(habit.newestRep))
    const diffInDays = differenceInDays(new Date(), lastRepDate)

    return diffInDays >= habit.frequency
  })
  // console.log('saving to storage')

  localStorage.setItem(
    'trackbuddy-today',
    JSON.stringify({ day: Date.now(), todos: habitsToDoToday })
  )
}
