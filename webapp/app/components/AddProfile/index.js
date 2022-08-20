import React from 'react';
import { TextField, Button } from '@mui/material';
import { API } from 'aws-amplify';
import { findProfiles as findProfilesMutation } from '../../custom-gql';
import AddInstagramProfile from './AddInstagramProfile';

import '../../styles/AddProfile.css';

const AddProfile = ({ platform, handleSubmit, cancel }) => {
    const userRef = React.useRef();

    const [state, setState] = React.useState({
        screen: 'sign-in',
        profiles: [],
    });

    const onSubmitClick = () => {
        handleSubmit(state.profiles, platform);
    };

    const onCancelClick = () => {
        cancel()
    }

    const findProfiles = React.useCallback(async (platform, accessToken) => {
        try {
            const response = await API.graphql({
                query: findProfilesMutation,
                variables: {
                    platform: platform,
                    accessToken,
                }
            });

            const { profiles, success } = response.data.findProfiles;
            if (success) {
                setState((prevState) => ({
                    ...prevState,
                    screen: 'verify',
                    profiles,
                }));
            }
        } catch (err) {
            console.error('Failed to find profiles')
        }
    }, []);

    const getContent = () => {
        switch(platform) {
            case 'instagram':
                return (
                    <AddInstagramProfile
                        screen={state.screen}
                        cancel={cancel}
                        profiles={state.profiles}
                        findProfiles={findProfiles}
                        onSubmitClick={onSubmitClick}
                    />
                );

            default:
                return (
                    <div className="AddProfile-form">
                        <div className="AddProfile-header">
                            Add {platform} account
                        </div>
                        <div className="AddProfile-username">
                            <TextField inputRef={userRef} variant="outlined" label="username"/>
                        </div>
                        <div className="AddProfile-buttons">
                            <Button onClick={onSubmitClick}>Add Account</Button>
                            <Button onClick={onCancelClick}>Cancel</Button>
                        </div>
                    </div>
                );
                
        }
    }

    return (
        <div className="AddProfile">
            <div className="AddProfile-left">

            </div>
            <div className="AddProfile-right">
               { getContent() }
            </div>
        </div>
    );
}

export default AddProfile;