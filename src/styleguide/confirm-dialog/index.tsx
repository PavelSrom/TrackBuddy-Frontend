import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@material-ui/core'
import { Button } from '../button'

type Props = Omit<DialogProps, 'open' | 'onClose'> & {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<unknown>
  loading?: boolean
  title?: string
  description?: string
}

export const ConfirmDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action is irreversible!',
  loading = false,
  ...dialogProps
}) => {
  return (
    <Dialog
      {...dialogProps}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle className="pb-0">{title}</DialogTitle>
      <DialogContent>
        <p>{description}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          loading={loading}
          variant="contained"
          color="secondary"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
