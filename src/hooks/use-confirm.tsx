import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@material-ui/core'
import { Button } from '../styleguide/button'

type ReturnType = {
  ConfirmDialog: React.FC<Omit<DialogProps, 'open' | 'onClose'>>
  triggerConfirm: () => void
}

type ConfirmProps = {
  title?: string
  description?: string
  onCancel: () => void
  onConfirm: () => void
}

export const useConfirm = ({
  title = 'Are you sure?',
  description = 'This action is irreversible!',
  onCancel,
  onConfirm,
}: ConfirmProps): ReturnType => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const triggerConfirm = (): void => setDialogOpen(true)

  return {
    ConfirmDialog: (props: Omit<DialogProps, 'open' | 'onClose'> = {}) => (
      <Dialog
        {...props}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="pb-0">{title}</DialogTitle>
        <DialogContent>
          <p>{description}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false)
              onCancel()
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setDialogOpen(false)
              onConfirm()
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    ),
    triggerConfirm,
  }
}
