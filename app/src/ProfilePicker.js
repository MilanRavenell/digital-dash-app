import React from 'react';
import { Button, IconButton } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

import profPic from './twit_prof_pic.jpeg';
import coverPic from './twit_cover.jpeg';
import twitLogo from './twitter_logo.png';
import ytLogo from './youtube_logo.png';

import './styles/ProfilePicker.css';

const ProfilePicker = ({ profiles, selectedProfileNames, handleProfileClick, expanded, toggleExpanded, editMode }) => {

    const onProfileClick = (profile) => {
        if (editMode) {
            return;
        }

        if (profile === 'select-all') {
            handleProfileClick(profiles.map(profile => profile.username));
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
        <div className="ProfilePicker-expand">
            <div className="ProfilePicker-expanded-header">
                <div className="ProfilePicker-expanded-header-text">
                    Profiles
                </div>
                {
                    !editMode && (
                        <div className="ProfilePicker-expand-header-minimize" onClick={toggleExpanded}>
                            <IconButton>
                                <ArrowBackIos/>
                            </IconButton>
                        </div>
                    )
                }
            </div>
            {
                !editMode && (
                    <div className="ProfilePicker-expand-button">
                        <Button onClick={() => {onProfileClick('select-all')}}>Select All</Button>
                        <Button onClick={() => {onProfileClick('select-none')}}>Select None</Button>
                    </div>
                )
            }
            {
                profiles.map((profile, index) => (
                    <div className="ProfilePicker-expand-profile-container">
                        <div className="ProfilePicker-expand-profile"
                            key={index}
                            onClick={() => {onProfileClick(profile.username)}}
                            style={selectedStyle(profile.username)}>
                            <div className="ProfilePicker-expand-profile-platform">
                                <div className="ProfilePicker-expand-profile-platform-logo" style={{
                                    backgroundImage: `url(${profile.platform === 'twitter' ? twitLogo : ytLogo })`,
                                }}/>
                            </div>
                            <div className="ProfilePicker-expand-profile-details">
                                <div className="ProfilePicker-expand-profile-pic-overlay">
                                    <div className="ProfilePicker-expand-profile-pic" style={{
                                        backgroundImage: `url(${profPic})`,
                                    }}/>
                                </div>
                                <div className="ProfilePicker-expand-profile-cover" style={{
                                        backgroundImage: `url(${coverPic})`,
                                    }}/>
                                <div className="ProfilePicker-expand-profile-username">
                                    {profile.username}
                                </div>
                            </div>
                        </div>
                        {
                            editMode && (
                                <div className="ProfilePicker-expand-profile-delete">
                                    <Button>Delete</Button>
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
    
    const getMinimizedContent = () => (
        <div className="ProfilePicker-minimize">
            <div className="ProfilePicker-minimize-expand" onClick={toggleExpanded}>
                <IconButton>
                    <ArrowForwardIos/>
                </IconButton>
            </div>
            {
                profiles.map((profile, index) => (
                    <div className="ProfilePicker-minimize-profile" key={index}>
                        <div className="ProfilePicker-minimize-profile-pic" style={{ 
                            ...selectedStyle(profile.username),
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