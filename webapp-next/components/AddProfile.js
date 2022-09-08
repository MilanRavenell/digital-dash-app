import React from 'react';
import { Button } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { platformToLogoUrlMap } from '../helpers';
import ProfileCard from './ProfileCard';

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
                        <div className={styles.formContent}>
                            <div className={styles.buttons}>
                                <div>
                                    <Button onClick={login}>Sign in with {platform}</Button>
                                </div>
                                <div>
                                    <Button onClick={cancel}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'verify':
                return (
                    <div className={styles.form}>
                        <div className={styles.profiles}>
                        {
                            (state.profiles !== null && state.profiles !== undefined) && 
                            state.profiles.map((profile, index) => (
                                <div className={styles.profile}>
                                    <ProfileCard 
                                        profile={{
                                            ...profile,
                                            platform,
                                        }}
                                        key={index}
                                    />
                                </div>
                            ))
                        }
                        </div>
                        <div className={styles.buttons}>
                            <div>
                                <Button onClick={onSubmitClick}>Confirm</Button>
                            </div>
                            <div>
                                <Button onClick={cancel}>Cancel</Button>
                            </div>
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
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <img
                                src={platformToLogoUrlMap[platform].url}
                                alt='profile pic'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'contain',
                                }}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className={styles.title}>
                            Add {platform[0].toUpperCase() + platform.slice(1)} Account
                        </div>
                    </div>
                    { getContent() }
                </div>
            </div>
        </div>
    );
}

export default AddProfile;