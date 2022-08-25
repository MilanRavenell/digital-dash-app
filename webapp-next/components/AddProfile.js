import React from 'react';
import { Button } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import styles from '../styles/AddProfile.module.css';

const AddProfile = ({
    user,
    currentProfiles,
    platform,
    loginHandler,
    loginCallbackHandler,
    handleSubmit,
    cancel
}) => {
    const session = useSession();
    const router = useRouter();

    const [state, setState] = React.useState({
        screen: 'sign-in',
        profiles: [],
    });

    const setProfiles = (profiles) => {
        setState((prevState) => ({
            ...prevState,
            screen: 'verify',
            profiles,
        }));
    }

    React.useEffect(() => {
        if (loginCallbackHandler) {
            if (session && session.status === 'authenticated' && state.profiles.length === 0) {
                loginCallbackHandler(session.data, currentProfiles, setProfiles);
            }
        }
    });

    const onSubmitClick = () => {
        handleSubmit(user, state.profiles, platform);
    };

    const login = () => {
        loginHandler({
            currentProfiles,
            setProfiles,
            router,
        });
    };

    const getContent = () => {
        switch(state.screen) {
            case 'sign-in':
                return (
                    <div className={styles.form}>
                        <div className={styles.header}>
                            Add {platform} account
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={login}>Log into {platform}</Button>
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
                            (state.profiles !== null && state.profiles !== undefined) && 
                            state.profiles.map((profile, index) => (
                                <div className={styles.profile} key={index}>
                                    { profile.profileName }
                                </div>
                            ))
                        }
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={onSubmitClick}>Confirm</Button>
                            <Button onClick={signOut}>Log iout o {platform}</Button>
                            <Button onClick={cancel}>Cancel</Button>
                        </div>
                    </div>
                );
            default:
                return;
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