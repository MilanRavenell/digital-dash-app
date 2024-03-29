import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { platformProperties } from '../helpers';
import ProfileCard from './ProfileCard';
import AddPlatformInstructions from './AddPlatformInstructions';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../styles/AddProfile.module.css';

const AddProfile = ({
    user,
    currentProfiles,
    platform,
    loginHandlers,
    loginCallbackHandler,
    handleSubmit,
    navigateToPrivacyPolicy,
    cancel,
}) => {
    const session = useSession();
    const router = useRouter();

    const [screen, setScreen] = React.useState('sign-in');
    const [profiles, setProfiles] = React.useState([]);
    const [textFieldValue, setTextFieldValue] = React.useState('');
    const [didFail, setDidFail] = React.useState(false);
    const [googleButtonHover, setGoogleButtonHover] = React.useState(false);
    const [googleButtonMouseDown, setGoogleButtonMouseDown] = React.useState(false);

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    }

    const setVerify = (profiles) => {
        setDidFail(false);
        setProfiles(profiles);
        setScreen('verify');
    }

    const setFail = () => {
        setDidFail(true);
        setScreen('sign-in')
    }

    React.useEffect(() => {
        console.log(profiles)
        if (loginCallbackHandler) {
            if (session && session.status === 'authenticated' && profiles.length === 0) {
                loginCallbackHandler({ sessionData: session.data, currentProfiles, setVerify });
                return;
            }
            if (router.query.code && profiles.length === 0) {
                const code = router.query.code.split('#_')[0];
                loginCallbackHandler({ code, currentProfiles, setVerify });
                return;
            }
        }
    }, []);

    const onSubmitClick = () => {
        handleSubmit(user, profiles);
    };

    const login = (index) => {
        setScreen('loading');
        loginHandlers[index]({
            currentProfiles,
            router,
            handle: textFieldValue,
            setVerify,
            setFail,
        });
    };

    const platformButtons = () => {
        switch(platform) {
            case 'twitter':
            default:
                return (
                    <div>
                        <Button onClick={() => { login(0); }}>Register {platform} Account</Button>
                    </div>
                );
            case 'youtube':
                return (
                    <div
                        className={styles.googleButtonContainer}
                        onMouseEnter={() => {setGoogleButtonHover(true)}}
                        onMouseLeave={() => {setGoogleButtonHover(false)}}
                        onMouseDown={() => {setGoogleButtonMouseDown(true)}}
                        onMouseUp={() => {setGoogleButtonMouseDown(false)}}
                    >
                        <img
                            className={styles.googleButton}
                            onClick={() => { login(0); }}
                            src={(() => {
                                if (googleButtonMouseDown) {
                                    return '/google_signin_buttons/web/2x/btn_google_signin_light_pressed_web@2x.png';
                                }

                                if (googleButtonHover) {
                                    return '/google_signin_buttons/web/2x/btn_google_signin_light_focus_web@2x.png';
                                }

                                return '/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png';
                            })()}
                        />
                    </div>
                );
            case 'instagram':
                switch(screen) {
                    case 'sign-in-register-ig-basic':
                        return (
                            <div>
                                <div>
                                    <TextField id="outlined-basic" label="Instagram handle" variant="outlined" onChange={handleTextFieldChange}/>
                                </div>
                                <div>
                                    <Button onClick={() => { login(0); }}>Confirm</Button>
                                </div>
                            </div>
                        )
                    default:
                        return (
                            <div>
                                {/* <div>
                                    <Button onClick={() => { setScreen('sign-in-register-ig-basic'); }}>
                                        Register Instagram Account
                                    </Button>
                                </div> */}
                                <div>
                                    <Button onClick={() => { login(1); }}>Register Instagram Account</Button>
                                </div>
                            </div>
                        )
                }
            case 'tiktok':
                return (
                    <div>
                        <div>
                            <TextField id="outlined-basic" label="Tiktok handle" variant="outlined" onChange={handleTextFieldChange}/>
                        </div>
                        <div>
                            <Button onClick={() => { login(0); }}>Register Tiktok Account</Button>
                        </div>
                    </div>
                )
        }
    }

    const getContent = () => {
        switch(screen) {
            case 'sign-in':
            case 'sign-in-register-ig-basic':
                return (
                    <div className={styles.form}>
                        <div className={styles.formContent}>
                            {
                                didFail && (
                                    <div className={styles.error}>Could not retrieve profile, please try again</div>
                                )
                            }
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
                            (profiles !== null && profiles !== undefined) && 
                            profiles.map((profile, index) => (
                                <div className={styles.profile} key={index}>
                                    <ProfileCard 
                                        profile={{
                                            ...profile,
                                            platform,
                                        }}
                                        isAddProfileConfirmation={true}
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
            case 'loading':
                return (
                    <div className={styles.form}>
                        <div className={styles.loading}>
                            <CircularProgress/>
                        </div>
                        <div className={styles.buttons}>
                            <div>
                                <Button onClick={cancel}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )
            default:
                return;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
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
                                    src={platformProperties[platform].logoUrl}
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
                    <div className={styles.privacyPolicy}>
                        <Button
                            sx={{color: 'gray'}}
                            onClick={navigateToPrivacyPolicy}
                        >
                            Privacy Policy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProfile;