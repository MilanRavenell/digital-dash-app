import React from 'react';
import { useRouter } from 'next/router';
import SignIn from '../components/SignIn';
import AppContext from '../components/AppContext';
import axios from 'axios';
import "@aws-amplify/ui-react/styles.css";

import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

export default function Home() {
    const context = React.useContext(AppContext);
    const router = useRouter();

    const [screen, setScreen] = React.useState('sign-in');

    React.useEffect(() => {
        if (context.user && !context.user.submittedAccessCode) {
            setScreen('emailSignUp');
        }

        if (context.invalidAccessCode) {
            context.setSignInStatusMessage({
                message: 'Access code was invalid',
                isPositive: false,
            })
        }
    }, [context.invalidAccessCode, context.user]);

    const setScreenCallback = React.useCallback((value) => {
        setScreen(value);
        context.setSignInStatusMessage(null);
    }, [context.setSignInStatusMessage])

    const resendAccessCodeEmail = React.useCallback(async () => {
        try {
            await axios.get(`/api/send-request-access-code-sqs?email=${context.user.email}&firstName=${context.user.firstName}`);
            context.setSignInStatusMessage({
                message: 'Email successfully sent',
                isPositive: true,
            });
        } catch (err) {
            console.error('Failed to resend access code email', err);
            context.setSignInStatusMessage({
                message: 'Failed to resend email',
                isPositive: false,
            });
        }
        
        return false;
    }, [context.user]);

    const openPrivacyPolicy = () => {
        router.push('/privacy-policy');
    }

    const navigateToHomepage = () => {
        router.push('/homepage');
    }
    
    return (
        <div className='container'>
            <SignIn
                screen={screen}
                user={context.user}
                loading={context.loading}
                statusMessage={context.signInStatusMessage}
                submitAccessCodeCallback={context.submitAccessCodeCallback}
                resendAccessCodeEmail={resendAccessCodeEmail}
                signOut={context.signOut}
                openPrivacyPolicy={openPrivacyPolicy}
                setScreen={setScreenCallback}
                signUpForEmail={() => {context.setCanEmailCallback(true)}}
                removeFromEmail={() => {context.setCanEmailCallback(false)}}
                deleteUser={context.deleteUserCallback}
                onLogoClick={navigateToHomepage}
            />
        </div>
    )
}
