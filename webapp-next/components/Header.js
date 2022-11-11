import React from 'react';
import { MenuItem, Menu, IconButton, Button } from '@mui/material';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import styles from '../styles/Header.module.css';

const Header = ({
    user,
    isHomepage,
    goToAddPlatformSelection,
    onLoginButtonPressed,
    onLogoClick,
    signOut,
    deleteAccount,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openSettingsMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeSettingsMenu = () => {
        setAnchorEl(null);
    }

    const [dialogueOpen, setDialogueOpen] = React.useState(false);
    const [dialogueTitle, setDialogueTitle] = React.useState(null);
    const [dialogueDescription, setDialogueDescription] = React.useState(null);
    const [dialogueOnClick, setDialogueOnClick] = React.useState(null);

    const signOutPressed = () => {
        openDialogue(
            'Sign Out',
            'Are you sure you want to sign out?',
            signOut,
        )
    }

    const deleteAccountPressed = () => {
        openDialogue(
            'Delete Account',
            'Are you sure you want to delete your account?',
            deleteAccount,
        )
    }

    const closeDialogue = () => {
        setDialogueOpen(false);
        setDialogueTitle(null);
        setDialogueDescription(null);
        setDialogueOnClick(null);
    }

    const openDialogue = (
        title,
        description,
        onClick,
    ) => {
        const confirm = async () => {
            closeDialogue();
            await onClick();
        };

        setDialogueTitle(title);
        setDialogueDescription(description);
        setDialogueOnClick(()=>confirm);
        setDialogueOpen(true);
    }

    return (
        <div 
            className={styles.container}
            style={ isHomepage 
                ? {
                    height: '20vh',
                    maxHeight: '80px',
                }
                : {}
            }
        >
            <div className={styles.left}>
                <div className={styles.leftBanner}>
                    <img
                        src={'/orb_logo.png'}
                        alt={'media'}
                        loading='lazy'
                        referrerPolicy="no-referrer"
                        className={styles.logo}
                        onClick={onLogoClick}
                    />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightContent}>
                    {
                        (() => {
                            if (isHomepage) {
                                return (
                                    <div className={styles.loginButton}>
                                        <Button
                                            onClick={onLoginButtonPressed}
                                            variant='contained'
                                        >
                                            { user ? 'Back to Dashboard' : 'Get Started'}
                                        </Button>
                                    </div>
                                )
                            }

                            if (user) {
                                return [
                                    <div className={styles.rightContentName} key={'greeting'}>
                                        Hi, {user.firstName}
                                    </div>,
                                    <div className={styles.headerRightContentSettings} key={'button'}>
                                        <IconButton onClick={openSettingsMenu}>
                                            <SettingsOutlined fontSize="medium"/>
                                        </IconButton>
                                    </div>,
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={anchorEl !== null}
                                        onClose={closeSettingsMenu}
                                        key={'menu'}>
                                        {goToAddPlatformSelection && <MenuItem onClick={goToAddPlatformSelection}>Add/Remove Profiles</MenuItem>}
                                        <MenuItem onClick={signOutPressed}>Sign Out</MenuItem>
                                        <MenuItem onClick={deleteAccountPressed}>Delete Account</MenuItem>
                                    </Menu>
                                ];
                            } else {
                                
                            }
                        })()
                    }
                </div>
            </div>
            <Dialog
                open={dialogueOpen}
                onClose={closeDialogue}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    { dialogueTitle }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        { dialogueDescription }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogue}>Cancel</Button>
                    <Button onClick={dialogueOnClick} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Header;