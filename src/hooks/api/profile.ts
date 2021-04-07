/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { useSnackbar } from 'notistack'
import { getFullProfile, getUsersTags, updateProfile } from '../../api/profile'
import { ErrorResponse } from '../../types/error-response'

// TODO: replace <any> with a type

export const useProfileData = (options?: UseQueryOptions<any>) =>
  useQuery('profileData', getFullProfile, options)

export const useTags = (options?: UseQueryOptions<any>) =>
  useQuery('usersTags', getUsersTags, options)

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
