import React from 'react';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import ProfilePicker from './ProfilePicker';
import { platformToLogoUrlMap } from '../helpers';
import Image from 'next/image'

import styles from '../styles/AddProfileSelection.module.css';

const AddProfileSelection = ({
    user,
    profiles,
    handleProfileDelete,
    getProfiles,
    handlePlatformClick,
    handleContinueClick,
    isFirstLogin,
}) => {
    const platformList = ['twitter', 'youtube', 'instagram'];

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.leftPicker}>
                    <ProfilePicker
                        profiles={profiles}
                        user={user}
                        handleProfileDelete={handleProfileDelete}
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
        </div>
    );
}

export default AddProfileSelection;