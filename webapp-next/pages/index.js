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
import { getData as getDataQuery, populateAnalytics } from '../aws/custom-gql';

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
  const [selectedProfileNames, setSelectedProfileNames] = React.useState([]);
  const [timeframe, setTimeframe] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(null);

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
      const response = await getData(context.user.email);

      if (response && response.success) {
        setSelectedProfileNames(response.data.profiles.map(profile => profile.profileName))
        setTimeframe(response.data.timeframes[0]);
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
          records: response.dataUpdated ? response.data : prevData.records,
        }));
        setFetchRecentData(false);
      }
    } catch (err) {
      console.error('Failed to fetch most recent post data', err);
    }
  }

  const getData = async (username, timeframe, selectedProfileNames) => {
    const { startDate, endDate } = timeframe ?? {};
    console.log(startDate, endDate)

    try {
      const response = (await API.graphql({
        query: getDataQuery,
        variables: {
          username,
          startDate,
          endDate,
          selectedProfileNames,
        }
      })).data.getData;

      console.log('data')
      console.log(response)

      return response;
    } catch (err) {
      console.error('Failed to get data for user', err);
    }
  };

  const updateSelectedProfileName = React.useCallback(async (newSelectedProfileNames) => {
    const newData = await getData(
      context.user.email,
      timeframe,
      newSelectedProfileNames,
    );

    if (newData.success) {
      setData(newData.data);
      setSelectedProfileNames(newSelectedProfileNames);
    }
  }, [context, timeframe]);

  const updateTimeFrame = React.useCallback(async (newTimeframe) => {
    console.log(newTimeframe)

    if (!newTimeframe.startDate || !newTimeframe.endDate) {
      setTimeframe(newTimeframe);
      return;
    }

    const newData = await getData(
      context.user.email,
      newTimeframe,
      selectedProfileNames,
    );

    if (newData.success) {
      setData(newData.data);
      setTimeframe(newTimeframe);
    }
  }, [context, selectedProfileNames]);

  const goToAddPlatformSelection = React.useCallback(() => {
    router.push(`/add-profile-selection`);
  }, []);

  const getContent = () => {
    if (context.user && data) {
      return (
        <div className='container'>
          <Header user={context.user} goToAddPlatformSelection={goToAddPlatformSelection} signOut={signOut}/>
          <MainContentContainer
            data={data}
            selectedProfileNames={selectedProfileNames}
            timeframe={timeframe}
            setSelectedProfileNames={updateSelectedProfileName}
            setTimeframe={updateTimeFrame}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      )
    }

    return (
      <div className='container'>Loading</div>
    )
  }

  return  getContent();
}
