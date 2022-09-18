import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Add } from '@mui/icons-material';
import ProfilePicker from './ProfilePicker';
import { platformToLogoUrlMap } from '../helpers';
import Image from 'next/image'

import styles from '../styles/AddProfileSelection.module.css';

const AddProfileSelection = ({
    user,
    profiles,
    handleProfileDelete,
    handlePlatformClick,
    handleContinueClick,
    isFirstLogin,
}) => {
    const [profileIndexToDelete, setProfileIndexToDelete] = React.useState(null);
    console.log('toDelte')
    console.log(profileIndexToDelete)

    const handleClose = () => {
        setProfileIndexToDelete(null);
    }

    const handleDeleteConfirm = () => {
        handleProfileDelete(user, profiles, profileIndexToDelete);
        handleClose();
    }

    const platformList = ['twitter', 'youtube', 'instagram', 'tiktok'];

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.leftPicker}>
                    <ProfilePicker
                        profiles={profiles}
                        user={user}
                        setProfileIndexToDelete={setProfileIndexToDelete}
                        editMode
                    />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightContentContainer}>
                    <div className={styles.rightContent}>
                        <div className={styles.platforms}>
                            {
                                platformList.map((platform, index) => (
                                    <div className={styles.platform} key={index}>
                                        <Button
                                            className={styles.platformInner}
                                            variant="outlined"
                                            onClick={() => {handlePlatformClick(platform)}}
                                            key={platform}>
                                                <div className={styles.platformLogoNameContainer}>
                                                    <div className={styles.platformLogoName}>
                                                        <div className={styles.platformLogo}>
                                                            <img
                                                                src={platformToLogoUrlMap[platform].url}
                                                                alt='profile pic'
                                                                style={{
                                                                    height: '100%',
                                                                    width: '100%',
                                                                    objectFit: 'contain',
                                                                }}
                                                                referrerPolicy="no-referrer"
                                                            />
                                                        </div>
                                                        <div className={styles.platformName}>
                                                            { platform }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.platformPlus}>
                                                    <Add fontSize="large"/>
                                                </div>
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.button}>
                            <Button onClick={handleContinueClick}>{isFirstLogin ? 'Continue to Dashboard' : 'Back to Dashboard'}</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={(profileIndexToDelete !== null)}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Remove Account?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {(profileIndexToDelete !== null) && `Stop tracking analytics for ${profiles[profileIndexToDelete].profileName}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddProfileSelection;