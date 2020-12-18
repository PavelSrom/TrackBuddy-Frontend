import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentVerySatisfied from '@material-ui/icons/SentimentVerySatisfied'
import { MoodIcon } from '../types/mood-icon'

export const moodIcons: Record<number, MoodIcon> = {
  1: {
    icon: SentimentVeryDissatisfied,
    label: 'Awful',
  },
  2: {
    icon: SentimentDissatisfied,
    label: 'Bad',
  },
  3: {
    icon: SentimentSatisfied,
    label: 'Okay',
  },
  4: {
    icon: SentimentSatisfiedAlt,
    label: 'Good',
  },
  5: {
    icon: SentimentVerySatisfied,
    label: 'Great',
  },
}
