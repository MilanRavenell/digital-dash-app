import React from 'react';
import AppContext from '../components/AppContext';
import Homepage from '../components/Homepage';
import Header from '../components/Header';
import { useRouter } from 'next/router';

export default function HomePage() {
    const router = useRouter();
    const context = React.useContext(AppContext);

    const goToSignIn = () => {
        if (context.user) {
            router.push('/');
        }
        else {
            router.push('/sign-in');
        }
    }

    return (
        <div className='container'>
        {
            [
                <Header
                    key={'header'}
                    onLoginButtonPressed={goToSignIn}
                    user={context.user}
                    isHomepage={true}
                />,
                <Homepage key={'main'}/>,
            ]
        }
        </div>
        
    );
}