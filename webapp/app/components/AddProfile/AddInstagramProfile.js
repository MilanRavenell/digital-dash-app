import React from 'react';
import { Button } from '@mui/material';

import '../../styles/AddProfile.css';

const AddInstagramProfile = ({ screen, cancel, profiles, findProfiles, onSubmitClick }) => {
    const fbLogin = () => {
        FB.login((response) => {
            console.log(response)
            if (response.status === 'connected') {
                findProfiles('instagram', response.authResponse.accessToken)
            }
        }, { scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement,pages_show_list,business_management'})
    }

    const getContent = () => {
        switch(screen) {
            case 'sign-in':
                return (
                    <div className="AddProfile-form">
                        <div className="AddProfile-header">
                            Add Intagram account
                        </div>
                        <div className="AddProfile-buttons">
                            <Button onClick={fbLogin}>Log into facebook</Button>
                            <Button onClick={cancel}>Cancel</Button>
                        </div>
                    </div>
                );
            case 'verify':
                return (
                    <div className="AddProfile-form">
                        <div className="AddProfile-header">
                            Add these profiles?
                        </div>
                        <div className="AddProfile-profiles">
                        {
                            profiles.map((profile, index) => (
                                <div className="AddProfile-profile" key={index}>
                                    { profile.profileName }
                                </div>
                            ))
                        }
                        </div>
                        <div className="AddProfile-buttons">
                            <Button onClick={onSubmitClick}>Confirm</Button>
                            <Button onClick={cancel}>Cancel</Button>
                        </div>
                    </div>
                );
            default:
                return;
        }
    }

    return getContent();
}

export default AddInstagramProfile;