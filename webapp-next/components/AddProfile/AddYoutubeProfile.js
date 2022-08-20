import React from 'react';
import { Button } from '@mui/material';
import { signIn, signOut, useSession, } from 'next-auth/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

import styles from '../../styles/AddProfile.module.css';

const AddYoutubeProfile = ({ screen, cancel, profiles, findProfiles, onSubmitClick }) => {
    const googleButton = React.useRef();
    const handleSignIn = React.useCallback(async (response) => {
        console.log(response);
        console.log(gapi)
        
        const getChannelsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&mine=true&access_token=${response.access_token}`);
        console.log(getChannelsResponse);

        if (getChannelsResponse.status === 200) {
            findProfiles(getChannelsResponse.data.items, response.access_token);
        }
    }, []);

    const youtubeLogin = () => {
        client.requestAccessToken();
    }

    const client = google.accounts.oauth2.initTokenClient({
        client_id: '581336452597-6c80lf8ijdvhlmi00odvrqsj1iah9lad.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: handleSignIn,
    });

    const getContent = () => {
        switch(screen) {
            case 'sign-in':
                return (
                    <div className={styles.form}>
                        <div className={styles.header}>
                            Add Youtube account
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={youtubeLogin}>Log in google</Button>
                            <Button onClick={signOut}>Log out twitter</Button>
                            <Button onClick={cancel}>Cancel</Button>
                        </div>
                    </div>
                );
            case 'verify':
                return (
                    <div className={styles.form}>
                        <div className={styles.header}>
                            Add these profiles?
                        </div>
                        <div className={styles.profiles}>
                        {
                            profiles.map((profile, index) => (
                                <div className={styles.profile} key={index}>
                                    { profile.profileName }
                                </div>
                            ))
                        }
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={onSubmitClick}>Confirm</Button>
                            <Button onClick={cancel}>Cancel</Button>
                            <Button onClick={signOut}>Log out twitter</Button>
                        </div>
                    </div>
                );
            default:
                return;
        }
    }

    return getContent();
}

export default AddYoutubeProfile;