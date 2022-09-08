import React from 'react';
import { useRouter } from 'next/router';
import "@aws-amplify/ui-react/styles.css";
import {
    useAuthenticator,
    Authenticator,
} from "@aws-amplify/ui-react";

import styles from '../styles/SignIn.module.css';

const SignIn = ({}) => {
    const router = useRouter();
    const { authStatus } = useAuthenticator(context => [context.authStatus]);

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

    React.useEffect(() => {
        if (authStatus === 'authenticated') {
            router.push('/')
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.left}>
        
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