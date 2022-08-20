import React from 'react';
import { TextField, Button } from '@mui/material';
import { API } from 'aws-amplify';
import { findProfiles as findProfilesMutation } from '../../custom-gql';
import AddInstagramProfile from './AddInstagramProfile';
import AddTwitterProfile from './AddTwitterProfile';
import AddYoutubeProfile from './AddYoutubeProfile';

import styles from '../../styles/AddProfile.module.css';

const AddProfile = ({ user, currentProfiles, platform, handleSubmit, cancel }) => {
    const userRef = React.useRef();

    const [state, setState] = React.useState({
        screen: 'sign-in',
        profiles: [],
    });

    const onSubmitClick = () => {
        handleSubmit(user, state.profiles, platform);
    };

    const onCancelClick = () => {
        cancel()
    }

    const findInstagramProfiles = React.useCallback(async (accessToken) => {
        try {
            const response = await API.graphql({
                query: findProfilesMutation,
                variables: {
                    platform: 'instagram',
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

    const findTwitterProfiles = React.useCallback(async (data) => {
        const profile = {
            profileName: data.profileName,
            meta: JSON.stringify({
                id: data.id,
                oauthToken: data.oauth_token,
                oauthTokenSecret: data.oauth_token_secret,
            })
        };

        console.log('currPRofiles')
        console.log(currentProfiles)

        if (currentProfiles === null || currentProfiles.map(profile => profile.profileName).includes(profile.profileName)) {
            return;
        }

        setState((prevState) => ({
            ...prevState,
            screen: 'verify',
            profiles: [profile],
        }));
    }, [currentProfiles]);

    const findYoutubeProfiles = React.useCallback(async (channels, accessToken) => {
        const profiles = channels.map((channel) => ({
            profileName: channel.snippet.title,
            meta: JSON.stringify({
                id: channel.contentDetails.relatedPlaylists.uploads,
                accessToken,
            })
        }));

        if (currentProfiles === null) {
            return;
        }

        const curProfileNames = currentProfiles.map(profile => profile.profileName);
        const filteredProfiles = profiles.filter(({ profileName }) => !curProfileNames.includes(profileName));

        if (filteredProfiles.length > 0) {
            setState((prevState) => ({
                ...prevState,
                screen: 'verify',
                profiles: filteredProfiles,
            }));
        }
    }, [currentProfiles]);

    const getContent = () => {
        switch(platform) {
            case 'instagram':
                return (
                    <AddInstagramProfile
                        screen={state.screen}
                        cancel={cancel}
                        profiles={state.profiles}
                        findProfiles={findInstagramProfiles}
                        onSubmitClick={onSubmitClick}
                    />
                );
            case 'twitter':
                return (
                    <AddTwitterProfile
                        screen={state.screen}
                        cancel={cancel}
                        profiles={state.profiles}
                        findProfiles={findTwitterProfiles}
                        onSubmitClick={onSubmitClick}
                    />
                )
                case 'youtube':
                    return (
                        <AddYoutubeProfile
                            screen={state.screen}
                            cancel={cancel}
                            profiles={state.profiles}
                            findProfiles={findYoutubeProfiles}
                            onSubmitClick={onSubmitClick}
                        />
                    )

            default:
                return (
                    <div className={styles.form}>
                        <div className={styles.header}>
                            Add {platform} account
                        </div>
                        <div className={styles.username}>
                            <TextField inputRef={userRef} variant="outlined" label="username"/>
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={onSubmitClick}>Add Account</Button>
                            <Button onClick={onCancelClick}>Cancel</Button>
                        </div>
                    </div>
                );
                
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>

            </div>
            <div className={styles.right}>
               { getContent() }
            </div>
        </div>
    );
}

export default AddProfile;