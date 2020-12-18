import Edit from '@material-ui/icons/Edit'
import Sync from '@material-ui/icons/Sync'
import Home from '@material-ui/icons/Home'
import Equalizer from '@material-ui/icons/Equalizer'
import Assignment from '@material-ui/icons/Assignment'
import { NavigationItem } from '../types/navigation-item'

export const appNavigation: NavigationItem[] = [
  {
    value: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    value: '/habits',
    label: 'Habits',
    icon: Sync,
  },
  {
    value: '/journals',
    label: 'Journals',
    icon: Edit,
  },
  {
    value: '/planner',
    label: 'Planner',
    icon: Assignment,
  },
  {
    value: '/charts',
    label: 'Charts',
    icon: Equalizer,
  },
]
