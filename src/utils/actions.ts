import Edit from '@material-ui/icons/Edit'
import Sync from '@material-ui/icons/Sync'
import Home from '@material-ui/icons/Home'
import AddTask from '@material-ui/icons/AddTask'
import Equalizer from '@material-ui/icons/Equalizer'
import { blue, green, yellow, orange, red } from '@material-ui/core/colors'
import { Action } from '../types/action'

export const actions: Action[] = [
  {
    label: 'Make a journal entry',
    url: '/journals/new',
    enabled: true,
    icon: Edit,
    gradient: `linear-gradient(to right, ${blue['400']}, ${blue['700']})`,
  },
  {
    label: 'Add accomplished task',
    url: '/planner',
    enabled: false,
    icon: AddTask,
    gradient: `linear-gradient(to right, ${green['400']}, ${green['700']})`,
  },
  {
    label: 'Check off a habit',
    url: '/habits',
    enabled: false,
    icon: Sync,
    gradient: `linear-gradient(to right, ${yellow['400']}, ${yellow['700']})`,
  },
  {
    label: 'See my stats',
    url: '/charts',
    enabled: false,
    icon: Equalizer,
    gradient: `linear-gradient(to right, ${orange['400']}, ${orange['700']})`,
  },
  {
    label: 'See my dashboard',
    url: '/dashboard',
    enabled: false,
    icon: Home,
    gradient: `linear-gradient(to right, ${red['400']}, ${red['700']})`,
  },
]
