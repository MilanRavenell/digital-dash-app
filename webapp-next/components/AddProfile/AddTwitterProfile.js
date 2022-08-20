import React from 'react';
import { Button } from '@mui/material';
import { signIn, signOut, useSession, } from 'next-auth/react';

import styles from '../../styles/AddProfile.module.css';

const AddTwitterProfile = ({ screen, cancel, profiles, findProfiles, onSubmitClick }) => {
    const session = useSession();

    React.useEffect(() => {
        if (session && session.status === 'authenticated' && profiles.length === 0) {
            console.log(session)
            findProfiles(session.data)
        }
    });

    const getContent = () => {
        switch(screen) {
            case 'sign-in':
                return (
                    <div className={styles.form}>
                        <div className={styles.header}>
                            Add Twitter account
                        </div>
                        <div className={styles.buttons}>
                            <Button onClick={signIn}>Log into twitter</Button>
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

export default AddTwitterProfile;