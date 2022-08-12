import React from 'react';
import TabSwitchContainer from './TabSwitchContainer';
import { ButtonBase, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import ProfilePicker from './ProfilePicker';

import '../styles/AddPlatformSelection.css';

const AddPlatformSelection = ({ handlePlatformSelected, handleContinue, currentProfiles }) => {
    const platformList = ['twitter', 'youtube', 'tiktok'];

    return (
        <div className="AddPlatformSelection">
            <div className="AddPlatformSelection-left">
                <div className="AddPlatformSelection-left-picker">
                    <ProfilePicker
                        profiles={currentProfiles}
                        editMode
                    />
                </div>
            </div>
            <div className="AddPlatformSelection-right">
                <div className="AddPlatformSelection-right-content-container">
                    <div className="AddPlatformSelection-right-content">
                        <div className="AddPlatformSelection-platforms">
                            {
                                platformList.map((platform) => (
                                    <div className="AddPlatformSelection-platform">
                                        <Button
                                            className="AddPlatformSelection-platform-inner"
                                            variant="outlined"
                                            onClick={() => {handlePlatformSelected(platform)}}
                                            key={platform}>
                                                <div className="AddPlatformSelection-platform-logoName">
                                                    <div className="AddPlatformSelection-platform-logo">
                                                        hi
                                                    </div>
                                                    <div className="AddPlatformSelection-platform-name">
                                                        { platform }
                                                    </div>
                                                </div>
                                                <div className="AddPlatformSelection-platform-plus">
                                                    <Add fontSize="large"/>
                                                </div>
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="AddPlatformSelection-button">
                            <Button onClick={handleContinue}>Continue</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPlatformSelection;