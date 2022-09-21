import React from 'react';
import { Button, IconButton } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import Image from 'next/image';
import { platformToLogoUrlMap } from '../helpers';
import ProfileCard from './ProfileCard';

import profPic from './twit_prof_pic.jpeg';

import styles from '../styles/ProfilePicker.module.css';

const ProfilePicker = ({
    profiles,
    selectedProfileNames,
    user,
    handleProfileClick,
    expanded,
    toggleExpanded,
    editMode,
    setProfileIndexToDelete,
    handleNeedsRefresh,
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
                border: '2px solid var(--theme-light-blue)',
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
                (profiles || []).map((profile, index) => {
                    const profilePicUrl = (profile.profilePicUrl !== null && profile.profilePicUrl !== undefined) ? profile.profilePicUrl : '/';
                    return (
                        <div className={styles.profileContainerExpanded} key={index}>
                            <div className={styles.profileExpanded}
                                style={selectedStyle(profile.profileName)}>
                                <ProfileCard
                                    profile={profile}
                                    handleClick={() => {onProfileClick(profile.profileName)}}
                                    handleDelete={editMode ? () =>{setProfileIndexToDelete(index)} : null}
                                    handleNeedsRefresh={handleNeedsRefresh}
                                />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
    
    const getMinimizedContent = () => (
        <div className={styles.containerMinimized} onClick={toggleExpanded}>
            <div className={styles.expandMinimized}>
                <IconButton>
                    <ArrowForwardIos/>
                </IconButton>
            </div>
            {
                profiles
                    .filter(profile => selectedProfileNames.includes(profile.profileName))
                    .map((profile, index) => {
                        const profilePicUrl = (profile.profilePicUrl !== null && profile.profilePicUrl !== undefined) ? profile.profilePicUrl : '/';
                        return (
                            <div className={styles.profileMinimized} key={index}>
                                <div className={styles.profilePicMinimized}>
                                    <img
                                        src={profilePicUrl}
                                        alt='profile pic'
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'contain',
                                        }}
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                        )
                    })
            }
        </div>
    );

    return (expanded || editMode) ? getExpandedContent() : getMinimizedContent();
}

export default ProfilePicker;