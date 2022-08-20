import { SessionProvider } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import AppContext from '../components/AppContext';
import { API } from 'aws-amplify';
import { listUserProfiles } from '../graphql/queries';
import Head from 'next/head';
import Script from 'next/script';

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

import '../styles/global.css';

function MyApp({ Component, pageProps }) {
    const [userProfiles, setUserProfiles] = useState(null);
    const [user, setUser] = useState(null);

    const getUserProfiles = async (user) => {
        const profiles = (await API.graphql({
            query: listUserProfiles,
            variables: {
              user: user.email
            }
        })).data.listUserProfiles;
      
        console.log('profiles')
        console.log(profiles)

        return profiles.items;
    }

    useEffect(async () => {
        console.log('user')
        console.log(user)
        if (user === null || userProfiles) {
            return;
        }

        setUserProfiles(await getUserProfiles(user));
    });

    const setUserCallback = useCallback((inputUser) => {
        if (user) {
            return;
        }
        setUser(inputUser);
    }, [user])

    return (
        <AppContext.Provider value={{ user, userProfiles, setUserProfiles, setUserCallback }}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script strategy="lazyOnload" async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"/>
            <Script>
                {
                `window.fbAsyncInit = function() {
                    FB.init({
                        appId: '2891124427862126',
                        autoLogAppEvents: true,
                        xfbml: true,
                        version: 'v14.0'
                    })
                };`
                }
            </Script>
            <Script strategy="beforeInteractive" async defer src="https://accounts.google.com/gsi/client"/>
            <Script strategy="beforeInteractive" async defer src="https://apis.google.com/js/api.js"/>
            {/* <meta name="google-signin-client_id" content="581336452597-6c80lf8ijdvhlmi00odvrqsj1iah9lad.apps.googleusercontent.com"></meta> */}
            <Script>
                {
                    `function start() {
                        // 2. Initialize the JavaScript client library.
                        gapi.client.init({
                            'apiKey': 'AIzaSyC09ooSdhzZjl6WPBA_OI_EwnRbzFOnyUE'
                        }).then(function(response) {
                            console.log(response);
                        }, function(reason) {
                            console.log(reason);
                        });
                    };
                    // 1. Load the JavaScript client library.
                    gapi.load('client', start);`
                }
            </Script>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
        </AppContext.Provider>
    );
}

export default MyApp;