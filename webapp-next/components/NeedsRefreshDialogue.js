import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const NeedsRefreshDialogue = ({
    open,
    handleConfirm,
    handleClose,
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                This Account needs to be Refreshed
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Something went wrong and we have lost access to this account, please click 'Confirm' if you would like to re-authenticate
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Refresh
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NeedsRefreshDialogue;