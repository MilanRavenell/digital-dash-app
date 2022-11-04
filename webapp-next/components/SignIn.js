import React from 'react';
import "@aws-amplify/ui-react/styles.css";
import {
    useAuthenticator,
    Authenticator,
} from "@aws-amplify/ui-react";
import { platformProperties } from '../helpers';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../components/Footer';

import styles from '../styles/SignIn.module.css';

const platforms = ['twitter', 'youtube', 'instagram']

const SignIn = ({
    requestAccessCode,
    user,
    loading,
    statusMessage,
    submitAccessCodeCallback,
    resendAccessCodeEmail,
    signOut,
    openPrivacyPolicy,
}) => {
    const [submitLoading, setSubmmitLoading] = React.useState(false);
    const [resendLoading, setResendLoading] = React.useState(false);
    const [textFieldValue, setTextFieldValue] = React.useState('');

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    }

    const submit = async () => {
        setSubmmitLoading(true);
        await submitAccessCodeCallback(textFieldValue);
        setSubmmitLoading(false);
    }

    const resend = async () => {
        setResendLoading(true);
        await resendAccessCodeEmail();
        setResendLoading(false);
    }

    const authenticatorFormFields = {
        signUp: {
            given_name: {
                order:1,
                placeholder: 'First Name',
            },
            family_name: {
                order: 2,
                placeholder: 'Last Name',
            },
            email: {
                order: 4
            },
            password: {
                order: 5
            },
            confirm_password: {
                order: 6
            }
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.contentLeft}>
                        <div className={styles.title}>
                            Real-time analytics for all your social media accounts in one place - totally for free!
                        </div>
                        <div className={`${styles.icons} ${styles.grow}`}>
                        {
                            platforms.map(platform => (
                                <div className={styles.icon}>
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
                            ))
                        }
                        </div>
                        <div className={`${styles.screenshot} ${styles.grow}`}>
                            <img
                                src={'/screenshot.png'}
                                alt='screenshot'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '15px',
                                }}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className={styles.privacyPolicy}>
                                <Button
                                    onClick={openPrivacyPolicy}
                                    sx={{
                                        color: 'gray'
                                    }}
                                >
                                    Privacy Policy
                                </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.contentRight}>
                        {
                            (() => {
                                if (loading) {
                                    return (<CircularProgress/>)
                                }

                                if (user && requestAccessCode) {
                                    return (
                                        <div className={styles.accessCode}>
                                            <div className={styles.header}>
                                                Hi {user.firstName}, Orb is still in early development, so not everyone can use it quite yet. If you received an access code after signing up, submit it here. Otherwise, keep an eye out for future emails from us to stay in the loop for updates.
                                            </div>
                                            <div className={styles.textField}>
                                                <TextField
                                                    label="Access code"
                                                    onChange={handleTextFieldChange}
                                                />
                                            </div>
                                            {
                                                statusMessage &&
                                                    <div
                                                        className={styles.status}
                                                        style={{ color: statusMessage.isPositive ? 'green' : 'red' }}
                                                    >
                                                        { statusMessage.message }
                                                    </div>
                                            }
                                            <div className={styles.submit}>
                                                <LoadingButton
                                                    loading={submitLoading}
                                                    variant='outlined'
                                                    onClick={submit}
                                                >
                                                    Submit
                                                </LoadingButton>
                                            </div>
                                            <div className={styles.smallButton}>
                                                <Button
                                                    onClick={signOut}
                                                    sx={{ fontSize: '10px'}}
                                                >
                                                    Sign out
                                                </Button>
                                                <LoadingButton
                                                    loading={resendLoading}
                                                    sx={{ fontSize: '10px', marginTop: '2px' }}
                                                    onClick={resend}
                                                >
                                                    Didn't receive an email? Click here to resend
                                                </LoadingButton>
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div className={styles.authenticator}>
                                        <Authenticator formFields={authenticatorFormFields}/>
                                    </div>
                                );
                            })()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;