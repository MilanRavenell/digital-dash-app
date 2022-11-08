import React from 'react';
import AppContext from '../components/AppContext';
import Homepage from '../components/Homepage';
import Header from '../components/Header';
import { useRouter } from 'next/router';

export default function HomePage() {
    const router = useRouter();
    const context = React.useContext(AppContext);

    const navigateToSignIn = () => {
        if (context.user) {
            router.push('/');
        }
        else {
            router.push('/sign-in');
        }
    }

    const navigateToPrivacyPolicy = () => {
        router.push('/privacy-policy');
    }

    return (
        <div className='container'>
        {
            [
                <Header
                    key={'header'}
                    onLoginButtonPressed={navigateToSignIn}
                    user={context.user}
                    isHomepage={true}
                />,
                <Homepage
                    key={'main'}
                    navigateToPrivacyPolicy={navigateToPrivacyPolicy}
                />,
            ]
        }
        </div>
        
    );
}