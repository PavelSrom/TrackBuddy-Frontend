import React, { useState, useEffect } from 'react'
import { Chip } from '@material-ui/core'
import { PageTitle } from '../styleguide/page-title'
import { TextField } from '../styleguide/text-field'
import { Button } from '../styleguide/button'
import { useProfileData, useUpdateProfile } from '../hooks/api/profile'

export const DashboardPage: React.FC = () => {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>('')

  const { data: profile } = useProfileData()
  const { mutate: update } = useUpdateProfile()

  useEffect(() => {
    setTags(profile.tags)
  }, [profile.tags])

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
