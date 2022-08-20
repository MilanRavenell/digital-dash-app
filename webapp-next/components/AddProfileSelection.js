import React from 'react';
import TabSwitchContainer from './TabSwitchContainer';
import { ButtonBase, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import ProfilePicker from './ProfilePicker';


import styles from '../styles/AddProfileSelection.module.css';

const AddProfileSelection = ({
    user,
    profiles,
    handleProfileDelete,
    getProfiles,
    handlePlatformClick,
    handleContinueClick
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
                                                <div className={styles.platformLogoName}>
                                                    <div className={styles.platformLogo}>
                                                        hi
                                                    </div>
                                                    <div className={styles.platformName}>
                                                        { platform }
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
                            <Button onClick={handleContinueClick}>Continue</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProfileSelection;