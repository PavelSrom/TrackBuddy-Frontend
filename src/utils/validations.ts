import * as Yup from 'yup'

export const journalEntrySchema = Yup.object().shape({
  mood: Yup.number().min(1).max(5).required('required'),
  standout: Yup.string().required('required'),
  wentWell: Yup.string().required('required'),
  wentWrong: Yup.string().required('required'),
  betterNextTime: Yup.string().required('required'),
  excuses: Yup.string(),
  tags: Yup.array().of(Yup.string()),
})
