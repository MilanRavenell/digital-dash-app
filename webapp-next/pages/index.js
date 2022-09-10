import React from 'react';
import Header from '../components/Header';
import AppContext from '../components/AppContext';
import MainContentContainer from '../components/MainContentContainer';
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from 'next/router';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { createUser, createUserProfile } from '../aws/graphql/mutations';
import { getData, populateAnalytics } from '../aws/custom-gql';

import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

export default function Home() {
  const router = useRouter();
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user: authUser, signOut } = useAuthenticator((context) => [context.user]);
  const context = React.useContext(AppContext);

  const [data, setData] = React.useState(null);
  const [fetchRecentData, setFetchRecentData] = React.useState(false);

  React.useEffect(async () => {
    if (authStatus === 'unauthenticated') {
        router.push('/sign-in')
    }

    if (authStatus === 'configuring') {
      return;
    }

    if (context.user === null) {
      context.setUserCallback(authUser);
      return;
    }

    if (context.user && data === null) {
      await initialize();
      return
    }

    if (context.user && data && fetchRecentData) {
      await fetchMostRecentPostData();
    }
  });

  const initialize = async () => {
    try {
      const response = (await API.graphql({
        query: getData,
        variables: {
          username: context.user.email
        }
      })).data.getData;

      console.log(response.data)

      if (response.success) {
        setData(response.data);
        setFetchRecentData(true);
      }
    } catch (err) {
      console.error('Failed to initialize user', err);
      throw new Error();
    }
  }

  const fetchMostRecentPostData = async () => {
    console.log('fetching data')
    try {
      const response = (await API.graphql({
        query: populateAnalytics,
        variables: {
          username: context.user.email
        }
      })).data.populateAnalytics;
      
      console.log('done fetching');
      console.log(response)

      if (response.success) {
        setData((prevData) => ({
          ...prevData,
          records: response.dataUpdated ? response.data : prevState.data.records,
        }));
        setFetchRecentData(false);
      }
    } catch (err) {
      console.error('Failed to fetch most recent post data', err);
    }
  }

  const goToAddPlatformSelection = React.useCallback(() => {
    router.push(`/add-profile-selection`);
  }, []);

  const getContent = () => {
    if (context.user && data) {
      return (
        <div className='container'>
          <Header user={context.user} goToAddPlatformSelection={goToAddPlatformSelection} signOut={signOut}/>
          <MainContentContainer data={data}/>
        </div>
      )
    }

    return (
      <div className='container'>Loading</div>
    )
  }

  return  getContent();
}
