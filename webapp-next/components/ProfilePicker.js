import React from 'react';
import { Button, IconButton } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

import profPic from './twit_prof_pic.jpeg';
import coverPic from './twit_cover.jpeg';
import twitLogo from './twitter_logo.png';
import ytLogo from './youtube_logo.png';

import styles from '../styles/ProfilePicker.module.css';

const ProfilePicker = ({
    profiles,
    selectedProfileNames,
    user,
    handleProfileClick,
    expanded,
    toggleExpanded,
    editMode,
    handleProfileDelete
}) => {
    const onProfileClick = (profile) => {
        if (editMode) {
            return;
        }

        if (profile === 'select-all') {
            handleProfileClick(profiles.map(profile => profile.profileName));
            return;
        }

        if (profile === 'select-none') {
            handleProfileClick([]);
            return;
        }

        // deep copy selectedProfileNames
        const finalProfiles = [...selectedProfileNames];

        if (finalProfiles.includes(profile)) {
            finalProfiles.splice(finalProfiles.indexOf(profile), 1);
        } else {
            finalProfiles.push(profile);
        }
        
        handleProfileClick(finalProfiles);
    }

    const selectedStyle = (profile) => {
        if (editMode) {
            return;
        }

        if (selectedProfileNames.includes(profile)) {
            return {
                color: 'blue',
                border: '1px solid blue',
            }
        }
    }

    const getExpandedContent = () => (
        <div className={styles.containerExpanded}>
            <div className={styles.headerExpanded}>
                <div className={styles.headerTextExpanded}>
                    Profiles
                </div>
                {
                    !editMode && (
                        <div className={styles.headerMinimizeExpanded} onClick={toggleExpanded}>
                            <IconButton>
                                <ArrowBackIos/>
                            </IconButton>
                        </div>
                    )
                }
            </div>
            {
                !editMode && (
                    <div className={styles.buttonExpanded}>
                        <Button onClick={() => {onProfileClick('select-all')}}>Select All</Button>
                        <Button onClick={() => {onProfileClick('select-none')}}>Select None</Button>
                    </div>
                )
            }
            {
                (profiles || []).map((profile, index) => (
                    <div className={styles.profileContainerExpanded} key={index}>
                        <div className={styles.profileExpanded}
                            onClick={() => {onProfileClick(profile.profileName)}}
                            style={selectedStyle(profile.profileName)}>
                            <div className={styles.profilePlatformExpanded}>
                                <div className={styles.profilePlatformLogoExpanded} style={{
                                    backgroundImage: `url(${profile.platform === 'twitter' ? twitLogo : ytLogo })`,
                                }}/>
                            </div>
                            <div className={styles.profileDetailsExpanded}>
                                <div className={styles.profilePicOverlayExpanded}>
                                    <div className={styles.profilePicExpanded} style={{
                                        backgroundImage: `url(${profPic})`,
                                    }}/>
                                </div>
                                <div className={styles.profileCoverExpanded} style={{
                                        backgroundImage: `url(${coverPic})`,
                                    }}/>
                                <div className={styles.profileUsernameExpanded}>
                                    {profile.profileName}
                                </div>
                            </div>
                        </div>
                        {
                            editMode && (
                                <div className={styles.profileDeleteExpanded}>
                                    <Button onClick={()=>{handleProfileDelete(user, profiles, index)}}>Delete</Button>
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
    
    const getMinimizedContent = () => (
        <div className={styles.containerMinimized}>
            <div className={styles.expandMinimized} onClick={toggleExpanded}>
                <IconButton>
                    <ArrowForwardIos/>
                </IconButton>
            </div>
            {
                profiles.map((profile, index) => (
                    <div className={styles.profileMinimized} key={index}>
                        <div className={styles.profilePicMinimized} style={{ 
                            ...selectedStyle(profile.profileName),
                            backgroundImage: `url(${profPic})`,
                        }}/>
                    </div>
                ))
            }
        </div>
    );

    return (expanded || editMode) ? getExpandedContent() : getMinimizedContent();
}

export default ProfilePicker;