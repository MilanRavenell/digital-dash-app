import { SessionProvider } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import AppContext from '../components/AppContext';
import { API } from 'aws-amplify';
import { listUserProfiles } from '../aws/graphql/queries';
import Head from 'next/head';
import Script from 'next/script';
import { Authenticator } from '@aws-amplify/ui-react';
import { getUser } from '../graphql/queries';
import { useRouter } from 'next/router';

import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

import '../styles/global.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [userProfiles, setUserProfiles] = useState(null);
    const [user, setUser] = useState(null);

    const getUserProfiles = async (user) => {
        const profiles = (await API.graphql({
            query: listUserProfiles,
            variables: {
              user: user.email,
            }
        })).data.listUserProfiles;
      
        console.log('profiles')
        console.log(profiles)

        return profiles.items;
    }

    useEffect(async () => {
        if (user === null || userProfiles) {
            return;
        }

        setUserProfiles(await getUserProfiles(user));
    });

    const setUserCallback = useCallback(async (authUser) => {
        if (user) {
            return;
        }

        let ddbUser = (await API.graphql({ query: getUser, variables: { email: authUser.attributes.email }})).data.getUser;

        // User's first sign in, send to add-platform-selection
        if (ddbUser === null) {
            ddbUser = {
                email: authUser.attributes.email,
                firstName: authUser.attributes.given_name,
                lastName: authUser.attributes.family_name,
            }

            await API.graphql({ query: createUser, variables: { input: ddbUser }});

            setUser(ddbUser);
            router.push({
                pathname: `/add-profile-selection`,
                query: { f: 1 },
              });
        } else {
            setUser(ddbUser);
        }
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
            {/* This is so that youtube profile pictures load properly, sometimes get a 403 error when fetching image in img tag */}
            <meta name="referrer" content="no-referrer"></meta>
            <SessionProvider session={pageProps.session}>
                <Authenticator.Provider>
                    <Component {...pageProps} />
                </Authenticator.Provider>
            </SessionProvider>
        </AppContext.Provider>
    );
}

export default MyApp;