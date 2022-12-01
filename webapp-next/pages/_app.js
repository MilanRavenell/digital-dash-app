import { SessionProvider } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import AppContext from '../components/AppContext';
import { API } from 'aws-amplify';
import Head from 'next/head';
import Script from 'next/script';
import { Authenticator } from '@aws-amplify/ui-react';
import { getUser, getProfiles, listUserProfiles } from '../aws/graphql/queries';
import { initUser, submitAccessCode, updateUser, removeUser } from '../aws/graphql/mutations';
import { useRouter } from 'next/router';
import { Auth, Hub } from 'aws-amplify';
import axios from 'axios';


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
    const [invalidAccessCode, setInvalidAccessCode] = useState(false);
    const [signInStatusMessage, setSignInStatusMessage] = useState(null);
    const windowDimensions = useWindowDimension();

    const urlsNoRedirect = ['/sign-in', '/homepage', '/privacy-policy']

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then((response) => {
                setAuthUser(response);
            })
            .catch((err) => {
                if (err === 'The user is not authenticated') {
                    setLoading(false);
                    setAuthUser(nullAuthUser);
                } else {
                    console.error(err);
                }
            }); 
    }, []);

    useEffect(() => {
        setLoading(true);
        console.log('found auth user')

        if (authUser === nullAuthUser) {
            setLoading(false);
            if (!urlsNoRedirect.includes(router.pathname)) {
                router.push('/homepage');
            }
            return;
        }

        if (authUser) {
            if (!user) {
                setUserCallback(authUser);
            }
        }

        // Clear sign in status if any
        setSignInStatusMessage(null);
    }, [authUser]);

    useEffect(() => {
        console.log('updating user', user)

        if (user) {
            if (!user.hasAccess) {
                setLoading(false);
                if (!urlsNoRedirect.includes(router.pathname)) {
                    router.push('/sign-in');
                }
                return;
            }

            getUserProfiles(user)
                .then(async (profiles) => {
                    setUserProfiles(profiles);
                    
                    // If the user has no profiles, send them to add-profile
                    if (router.pathname === '/sign-in') {
                        if (profiles.length <= 0) {
                            console.log('Navigating to add profile');
                            await router.push({
                                pathname: `/add-profile`,
                                query: { f: 1 },
                            });
                        } else {
                            await router.push('/');
                        }
                    }
                    
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to get user profiles', err);
                    setLoading(false);
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
        const { success, profiles } = (await API.graphql({
            query: getProfiles,
            variables: {
                input: { owner: user.owner },
            }
        })).data.getProfiles;
      
        console.log('profiles')
        console.log(profiles)

        return profiles
    }

    const setUserCallback = useCallback(async (authUser) => {
        if (user || authUser === nullAuthUser) {
            return;
        }

        try {
            let ddbUser = (await API.graphql({ query: getUser, variables: { owner: authUser.username }, })).data.getUser;
            console.log('ddbuser: ', ddbUser)

            // User's first sign in, send to add-platform-selection
            if (ddbUser === null) {
                const { success, user: responseUser } = (await API.graphql({
                    query: initUser,
                    variables: {
                        input: {
                            email: authUser.attributes.email,
                            firstName: authUser.attributes.given_name,
                            lastName: authUser.attributes.family_name,
                            owner: authUser.username,
                        } 
                    }
                })).data.initUser;
                console.log(responseUser)

                if (success) {
                    ddbUser = responseUser;
                } else {
                    throw new Error('Failed to create new ddb user, see cloudwatch for more information');
                }
                
            }

            setUser(ddbUser);
        } catch (err) {
            console.error('Failed to initialize user from DDB', err);
        }
        
    }, [user]);

    const submitAccessCodeCallback = useCallback(async (accessCode) => {
        if (user) {
            try {
                const response = await API.graphql({
                    query: submitAccessCode,
                    variables: {
                        input: {
                            owner: user.owner,
                            accessCode,
                        }
                    }
                });

                console.log(response)
    
                if (response?.data?.submitAccessCode?.success) {
                    setUser({
                        ...user,
                        hasAccess: true,
                    });
                    setLoading(true);
                } else {
                    setInvalidAccessCode(true);
                }
            } catch (err) {
                console.error('Failed to submit access token', err);
            }
            
        }
    }, [user]);

    const setCanEmailCallback = useCallback(async (canEmail) => {
        try {
            await API.graphql({
                query: updateUser,
                variables: {
                    input: {
                        owner: user.owner,
                        canEmail,
                    },
                },
            });
    
            setUser((prevUser) => ({
                ...prevUser,
                canEmail,
            }));

            setSignInStatusMessage({
                message: canEmail
                    ? 'Added to email list'
                    : 'Removed from email list',
                isPositive: true,
            });
        } catch (err) {
            console.error(`Failed to set canEmail for user ${user.owner}`, err);
            setSignInStatusMessage({
                message: canEmail
                    ? 'Failed to add to email list'
                    : 'Failed to remove from email list',
                isPositive: false,
            });
        }
        
    }, [user]);

    const deleteUserCallback = useCallback(async () => {
        try {
            const response = await API.graphql({
                query: removeUser,
                variables: {
                    input: {
                        owner: user.owner,
                    },
                },
            });

            signOut();
        } catch (err) {
            console.error(`Failed to delete user, ${user.owner}`);
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
            invalidAccessCode,
            windowDimensions,
            isMobile: windowDimensions ? windowDimensions.width < 800 : false,
            signInStatusMessage,
            platforms: ['twitter', 'youtube', 'instagram', 'tiktok'],
            setUserProfiles,
            setSignInStatusMessage,
            setUserCallback,
            submitAccessCodeCallback,
            setCanEmailCallback,
            deleteUserCallback,
            signOut,
        }}>
            <Head>
                <title>Orb Real Time Analytics</title>
                <link rel="icon" href="/orb_512.png" />
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