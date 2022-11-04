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

    const [statusMessage, setStatusMessage] = React.useState(null);

    React.useEffect(() => {
        if (context.invalidAccessCode) {
            setStatusMessage({
                message: 'Access code was invalid',
                isPositive: false,
            })
        }
    }, [context.invalidAccessCode]);

    const resendAccessCodeEmail = React.useCallback(async () => {
        try {
            await axios.get(`/api/send-request-access-code-sqs?email=${context.user.email}&firstName=${context.user.firstName}`);
            setStatusMessage({
                message: 'Email successfully sent',
                isPositive: true,
            });
        } catch (err) {
            console.error('Failed to resend access code email');
            setStatusMessage({
                message: 'Failed to resend email',
                isPositive: false,
            });
        }
        
        return false;
    }, [context.user]);

    const openPrivacyPolicy = () => {
        router.push('/privacy-policy');
    }
    
    return (
        <div className='container'>
            <SignIn
                requestAccessCode={context.requestAccessCode}
                user={context.user}
                loading={context.loading}
                statusMessage={statusMessage}
                submitAccessCodeCallback={context.submitAccessCodeCallback}
                resendAccessCodeEmail={resendAccessCodeEmail}
                signOut={context.signOut}
                openPrivacyPolicy={openPrivacyPolicy}
            />
        </div>
    )
}
