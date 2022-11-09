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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import FollowUs from './FollowUs';

import styles from '../styles/SignIn.module.css';

const platforms = ['twitter', 'youtube', 'instagram']

const SignIn = ({
    screen,
    user,
    loading,
    statusMessage,
    submitAccessCodeCallback,
    resendAccessCodeEmail,
    signOut,
    openPrivacyPolicy,
    setScreen,
    signUpForEmail,
    removeFromEmail,
    deleteUser,
    onLogoClick,
}) => {
    const [submitLoading, setSubmmitLoading] = React.useState(false);
    const [emailToggleLoading, setEmailToggleLoadingLoading] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [textFieldValue, setTextFieldValue] = React.useState('');

    const [dialogueOpen, setDialogueOpen] = React.useState(false);
    const [dialogueDescription, setDialogueDescription] = React.useState(null);
    const [dialogueOnClick, setDialogueOnClick] = React.useState(null);

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    }

    const submitPressed = async () => {
        setSubmmitLoading(true);
        await submitAccessCodeCallback(textFieldValue);
        setSubmmitLoading(false);
    }

    const emailSignUpPressed = () => {
        openDialogue(
            '',
            'Join email list?',
            emailSignUpConfirmed,
        )
    }

    const emailRemovePressed = () => {
        openDialogue(
            '',
            'Leave email list?',
            emailRemoveConfirmed,
        )
    }

    const signOutPressed = () => {
        openDialogue(
            '',
            'Sign out?',
            signOut,
        )
    }

    const deleteUserPressed = () => {
        openDialogue(
            '',
            'Delete account?',
            deleteUserConfirmed,
        )
    }

    const emailSignUpConfirmed = async () => {
        setEmailToggleLoadingLoading(true);
        await signUpForEmail();
        setEmailToggleLoadingLoading(false);
    }

    const emailRemoveConfirmed = async () => {
        setEmailToggleLoadingLoading(true);
        await removeFromEmail();
        setEmailToggleLoadingLoading(false);
    }

    const deleteUserConfirmed = async () => {
        setDeleteLoading(true);
        await deleteUser()
        setDeleteLoading(false);
    }

    const closeDialogue = () => {
        setDialogueOpen(false);
        setDialogueDescription(null);
        setDialogueOnClick(null);
    }

    const openDialogue = (
        title,
        description,
        onClick,
    ) => {
        const confirm = async () => {
            closeDialogue();
            await onClick();
        };

        setDialogueDescription(description);
        setDialogueOnClick(()=>confirm);
        setDialogueOpen(true);
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

    const accessCodeHeaderText = (name) => (`Hi ${name}, Orb is still in early development, \
so not everyone can use it quite yet. Join the email list for a chance to receive an access \
code to the alpha version of our product. Otherwise, keep an eye out for future emails from us to \
stay in the loop for updates.`);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.contentLeft}>
                        <div 
                            className={styles.logoContainer}
                            onClick={onLogoClick}
                        >
                            <img
                                className={styles.logo}
                                src='/orb_logo.png'
                            />
                        </div>
                        <div className={styles.title}>
                            Real-time analytics for all your social media accounts in one place - totally for free!
                        </div>
                        <div className={`${styles.screenshot} ${styles.grow}`}>
                            <img
                                src={'/orb_home_page_photo1.png'}
                                alt='screenshot'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'contain',
                                    border: '1px solid gray',
                                }}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className={styles.supports}>
                            <div className={styles.supportsText}>
                                Supports:
                            </div>
                            <div className={`${styles.icons} ${styles.grow}`}>
                            {
                                platforms.map(platform => (
                                    <div className={styles.icon} key={platform}>
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
                        </div>
                        <div className={styles.bottom}>
                            <FollowUs/>
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

                                if (user && screen === 'emailSignUp') {
                                    return (
                                        <div className={styles.accessCode}>
                                            <div className={styles.header}>
                                                { accessCodeHeaderText(user.firstName) }
                                            </div>
                                            <div className={styles.buttons}>
                                                {
                                                    statusMessage &&
                                                        <div
                                                            className={styles.status}
                                                            style={{ color: statusMessage.isPositive ? 'green' : 'red' }}
                                                        >
                                                            { statusMessage.message }
                                                        </div>
                                                }
                                                <div className={styles.bigButton}>
                                                    <LoadingButton
                                                        loading={emailToggleLoading}
                                                        variant='outlined'
                                                        onClick={ user.canEmail
                                                            ? emailRemovePressed
                                                            : emailSignUpPressed
                                                        }
                                                    >
                                                        {
                                                            user.canEmail
                                                                ? 'Remove me from Email List'
                                                                : 'Add me to Email List'
                                                        }
                                                        
                                                    </LoadingButton>
                                                    <Button
                                                        variant='outlined'
                                                        onClick={()=>{setScreen('submitAccessCode')}}
                                                        sx={{ marginTop: '10px' }}
                                                    >
                                                        Submit Access Code
                                                    </Button>
                                                </div>
                                                <div className={styles.smallButton}>
                                                    <Button
                                                        onClick={signOutPressed}
                                                        sx={{ fontSize: '10px'}}
                                                    >
                                                        Sign out
                                                    </Button>
                                                    <LoadingButton
                                                        loading={deleteLoading}
                                                        sx={{ fontSize: '10px', marginTop: '2px' }}
                                                        onClick={deleteUserPressed}
                                                    >
                                                        Delete Account
                                                    </LoadingButton>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                if (screen === 'submitAccessCode') {
                                    return (
                                        <div className={styles.accessCode}>
                                            <div className={styles.header}>
                                                { accessCodeHeaderText(user.firstName) }
                                            </div>
                                            <div className={styles.buttons}>
                                                {
                                                    statusMessage &&
                                                        <div
                                                            className={styles.status}
                                                            style={{ color: statusMessage.isPositive ? 'green' : 'red' }}
                                                        >
                                                            { statusMessage.message }
                                                        </div>
                                                }
                                                <div className={styles.textField}>
                                                    <TextField
                                                        label="Access code"
                                                        onChange={handleTextFieldChange}
                                                    />
                                                </div>
                                                <div className={styles.bigButton}>
                                                    <LoadingButton
                                                        loading={submitLoading}
                                                        variant='outlined'
                                                        onClick={submitPressed}
                                                    >
                                                        Submit
                                                    </LoadingButton>
                                                </div>
                                                <div className={styles.smallButton}>
                                                    <Button
                                                        onClick={() => {setScreen('emailSignUp')}}
                                                        sx={{ fontSize: '10px'}}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
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
                <Dialog
                    open={dialogueOpen}
                    onClose={closeDialogue}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        { dialogueDescription }
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={closeDialogue}>Cancel</Button>
                        <Button onClick={dialogueOnClick} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default SignIn;