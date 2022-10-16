import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { platformToLogoUrlMap } from '../helpers';
import ProfileCard from './ProfileCard';
import AddPlatformInstructions from './AddPlatformInstructions';

import styles from '../styles/AddProfile.module.css';

const AddProfile = ({
    user,
    currentProfiles,
    platform,
    loginHandlers,
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
    const [textFieldValue, setTextFieldValue] = React.useState('');

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    }

    const setProfiles = (profiles) => {
        setState((prevState) => ({
            ...prevState,
            screen: 'verify',
            profiles,
        }));
    }

    React.useEffect(() => {
        console.log(user)
        console.log(state.profiles)
        if (loginCallbackHandler) {
            if (session && session.status === 'authenticated' && state.profiles.length === 0) {
                loginCallbackHandler({ sessionData: session.data, currentProfiles, setProfiles });
                return;
            }
            if (router.query.code && state.profiles.length === 0) {
                const code = router.query.code.split('#_')[0];
                loginCallbackHandler({ code, currentProfiles, setProfiles });
                return;
            }
        }
    }, []);

    const onSubmitClick = () => {
        handleSubmit(user, state.profiles);
    };

    const login = (index) => {
        loginHandlers[index]({
            currentProfiles,
            setProfiles,
            router,
            handle: textFieldValue,
        });
    };

    const platformButtons = () => {
        switch(platform) {
            case 'twitter':
            case 'youtube':
            default:
                return (
                    <div>
                        <Button onClick={() => { login(0); }}>Sign in with {platform}</Button>
                    </div>
                );
            case 'instagram':
                return (
                    <div>
                        <div>
                            <Button onClick={() => { login(0); }}>Sign in with Instagram Basic</Button>
                        </div>
                        <div>
                            <Button onClick={() => { login(1); }}>Sign in with Instagram Pro</Button>
                        </div>
                    </div>
                )
            case 'tiktok':
                return (
                    <div>
                        <div>
                            <TextField id="outlined-basic" label="Tiktok handle" variant="outlined" onChange={handleTextFieldChange}/>
                        </div>
                        <div>
                            <Button onClick={() => { login(0); }}>Register Tiktok account</Button>
                        </div>
                    </div>
                )
        }
    }

    const getContent = () => {
        switch(state.screen) {
            case 'sign-in':
                return (
                    <div className={styles.form}>
                        <div className={styles.formContent}>
                            <div className={styles.buttons}>
                                { platformButtons() }
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
                                <div className={styles.profile} key={index}>
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
                <div className={styles.contentLeft}>
                    <AddPlatformInstructions platform={platform}/>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.contentRight}>
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