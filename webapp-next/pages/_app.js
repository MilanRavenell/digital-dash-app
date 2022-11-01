import { SessionProvider } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import AppContext from '../components/AppContext';
import { API } from 'aws-amplify';
import { listUserProfiles } from '../aws/graphql/queries';
import Head from 'next/head';
import Script from 'next/script';
import { Authenticator } from '@aws-amplify/ui-react';
import { getUser } from '../aws/graphql/queries';
import { initUser, submitAccessCode } from '../aws/graphql/mutations';
import { useRouter } from 'next/router';
import { Auth, Hub } from 'aws-amplify';


import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

import '../styles/global.css';

const nullAuthUser = 'nullAuthUser';

const useWindowDimension = () => {
    const getWindowDimensions = () => {
        if (typeof window !== "undefined") {
            const { innerWidth: width, innerHeight: height } = window;
            return {
                width,
                height
            };
        }
    };

    const [windowDimensions, setWindowDimensions] = useState(null);

    useEffect(() => {
        setWindowDimensions(getWindowDimensions());
        
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();
    const [userProfiles, setUserProfiles] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [user, setUser] = useState(null);
    const [numProfileChecks, setNumProfileChecks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [requestAccessCode, setRequestAccessCode] = useState(false);
    const [invalidAccessCode, setInvalidAccessCode] = useState(false);
    const windowDimensions = useWindowDimension();

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then((response) => {
                setAuthUser(response);
            })
            .catch((err) => {
                if (err === 'The user is not authenticated') {
                    setLoading(false);
                    setAuthUser(nullAuthUser);
                    if (router.pathname !== '/sign-in') {
                        router.push('/sign-in');
                    }
                } else {
                    console.error(err);
                }
            }); 
    }, []);

    useEffect(() => {
        setLoading(true);
        console.log('found auth user')
        if (authUser) {
            if (!user) {
                setUserCallback(authUser);
            }
        }

        if (authUser === nullAuthUser) {
            setLoading(false);
            if (router.pathname !== '/sign-in') {
                router.push('/sign-in');
            }
        }
    }, [authUser]);

    useEffect(() => {
        console.log('updating user')
        if (user) {
            if (!user.submittedAccessCode) {
                setRequestAccessCode(true);
                setLoading(false);
                if (router.pathname !== '/sign-in') {
                    router.push('/sign-in');
                }
                return;
            }

            if (router.pathname === '/sign-in') {
                router.push('/');
            }

            getUserProfiles(user)
                .then((profiles) => {
                    setUserProfiles(profiles);
                    
                    // If the user has no profiles, send them to add-profile-selection
                    if (profiles.length <= 0) {
                        router.push({
                            pathname: `/add-profile-selection`,
                            query: { f: 1 },
                        });
                    }

                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to get user profiles', err);
                });
        }
    }, [user]);

     // If there are new profiles that do not yet have posts collected, wait 10 seconds and fetch profiles
    // to see if all posts have yet been collected
    useEffect(() => {
        console.log('prof checks: ', numProfileChecks);
        
        if (userProfiles && userProfiles.some(profile => !profile.postsLastPopulated)) {
            console.log('need to check D:')
            setTimeout(async () => {
                setUserProfiles(await getUserProfiles(user));
                setNumProfileChecks(prev => prev + 1);
            }, 10000);
        }
    }, [userProfiles, numProfileChecks]);

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

    const setUserCallback = useCallback(async (authUser) => {
        if (user || authUser === nullAuthUser) {
            return;
        }

        let ddbUser = (await API.graphql({ query: getUser, variables: { email: authUser.attributes.email }, })).data.getUser;
        console.log('ddbuser: ', ddbUser)

        // User's first sign in, send to add-platform-selection
        if (ddbUser === null) {
            ddbUser = {
                email: authUser.attributes.email,
                firstName: authUser.attributes.given_name,
                lastName: authUser.attributes.family_name,
                owner: authUser.username,
            }

            const { success } = await API.graphql({ query: initUser, variables: { input: ddbUser }});

            if (success) {
                setUser(ddbUser);
            } else {
                console.error('Failed to create new ddb user')
            }
            
        } else {
            ddbUser = {
                ...ddbUser,
                owner: authUser.username,
            };
        }

        setUser(ddbUser);
    }, [user]);

    const submitAccessCodeCallback = useCallback(async (accessCode) => {
        if (user) {
            try {
                const response = await API.graphql({
                    query: submitAccessCode,
                    variables: {
                        input: {
                            username: user.email,
                            accessCode,
                        }
                    }
                });

                console.log(response)
    
                if (response?.data?.submitAccessCode?.success) {
                    setUser({
                        ...user,
                        submittedAccessCode: true,
                    })
                } else {
                    setInvalidAccessCode(true);
                }
            } catch (err) {
                console.error('Failed to submit access token', err);
            }
            
        }
    }, [user]);

    const signOut = useCallback(() => {
        Auth.signOut();
        setUser(null);
        setAuthUser(nullAuthUser);
    }, []);

    const listener = (data) => {
        console.log(data)
        switch ('listen: ', data.payload.event) {
            case 'signIn':
                console.log('setting auth: ', data.payload.data)
                setAuthUser(data.payload.data);
                break;
        }
    }
    Hub.listen('auth', listener);

    return (
        <AppContext.Provider value={{
            loading,
            user,
            userProfiles,
            requestAccessCode,
            invalidAccessCode,
            windowDimensions,
            isMobile: windowDimensions ? windowDimensions.width < 800 : false,
            setUserProfiles,
            setUserCallback,
            submitAccessCodeCallback,
            signOut,
        }}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script strategy="lazyOnload" async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"/>
            <Script>
                {
                `window.fbAsyncInit = function() {
                    FB.init({
                        appId: '${process.env.FB_API_ID}',
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
                            'apiKey': '${process.env.GOOG_API_KEY}'
                        }).then(function(response) {
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
            <meta name="viewport" content="width=device-width,initial-scale=1.0"></meta>
            <SessionProvider session={pageProps.session}>
                <Authenticator.Provider>
                    <Component {...pageProps} />
                </Authenticator.Provider>
            </SessionProvider>
        </AppContext.Provider>
    );
}

export default MyApp;