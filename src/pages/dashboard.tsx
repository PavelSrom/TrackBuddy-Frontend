import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { Chip } from '@material-ui/core'
import { useQuery, useMutation, queryCache } from 'react-query'
import { getFullProfile, updateProfile } from '../api/profile'
import { PageTitle } from '../styleguide/page-title'
import { ErrorResponse } from '../types/error-response'
import { TextField } from '../styleguide/text-field'
import { Button } from '../styleguide/button'

export const DashboardPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>('')

  const { data: profile } = useQuery('profileData', getFullProfile, {
    onSuccess: data => setTags(data.tags),
  })
  console.log(profile)

  const [update] = useMutation(updateProfile, {
    onSuccess: () => {
      enqueueSnackbar('Profile updated', { variant: 'success' })
      queryCache.invalidateQueries('profileData')
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })

  return (
    <>
      <PageTitle className="mt-4 mb-6">Dashboard (in progress)</PageTitle>

      <div className="flex justify-between mb-8">
        <TextField
          noFormik
          disabled={tags.length >= 8}
          value={newTag}
          onChange={e => setNewTag(e.target.value.toUpperCase().trim())}
          inputProps={{ maxLength: 15 }}
          label="New tag"
        />
        <Button
          onClick={() => {
            setTags(prev => Array.from(new Set([...prev, newTag])))
            setNewTag('')
          }}
        >
          Add
        </Button>
      </div>

      <p>Tags:</p>
      <div className="flex flex-wrap">
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            className="m-0.5"
            onDelete={() => setTags(prev => prev.filter(_tag => _tag !== tag))}
          />
        ))}
      </div>

      <Button onClick={() => update({ tags })} fullWidth className="mt-8">
        Save changes
      </Button>
    </>
  )
}
