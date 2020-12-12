import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core'

export const NonMobile: React.FC = () => (
  <Dialog open disableEscapeKeyDown>
    <DialogTitle>Non-mobile device detected</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Please use your smartphone to be able to use this application
      </DialogContentText>
    </DialogContent>
  </Dialog>
)
