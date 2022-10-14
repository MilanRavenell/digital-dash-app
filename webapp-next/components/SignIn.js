import React from 'react';
import { useRouter } from 'next/router';
import "@aws-amplify/ui-react/styles.css";
import {
    useAuthenticator,
    Authenticator,
} from "@aws-amplify/ui-react";
import { platformToLogoUrlMap } from '../helpers';

import styles from '../styles/SignIn.module.css';

const platforms = ['twitter', 'youtube', 'instagram', 'tiktok']

const SignIn = ({}) => {  
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
            <div className={styles.left}>
                <div className={styles.contentLeft}>
                    <div className={styles.title}>
                        Lightweight platform for tracking analytics for all your social media accounts in one place - totally for free!
                    </div>
                    <div className={`${styles.icons} ${styles.grow}`}>
                    {
                        platforms.map(platform => (
                            <div className={styles.icon}>
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
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.authenticator}>
                    <Authenticator formFields={authenticatorFormFields}/>
                </div>
            </div>
        </div>
    );
}

export default SignIn;