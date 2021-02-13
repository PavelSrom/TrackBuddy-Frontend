/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import { getFullProfile, getUsersTags, updateProfile } from '../../api/profile'
import { ErrorResponse } from '../../types/error-response'

export const useProfileData = () => useQuery('profileData', getFullProfile)

export const useTags = () => useQuery('usersTags', getUsersTags)

export const useUpdateProfile = () => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(updateProfile, {
    onSuccess: () => {
      enqueueSnackbar('Profile updated', { variant: 'success' })
      queryClient.invalidateQueries('profileData')
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })
}
