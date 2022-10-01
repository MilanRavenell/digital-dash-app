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

export default function App() {
  const router = useRouter();
  const context = React.useContext(AppContext);

  const [data, setData] = React.useState(null);
  const [init, setInit] = React.useState(true);
  const [selectedProfileNames, setSelectedProfileNames] = React.useState([]);
  const [timeframe, setTimeframe] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(null);
  const [profileToRefresh, setProfileToRefresh] = React.useState(null);

  React.useEffect(() => {
    if (context.user && init) {
      setInit(false);
      initialize();
      return;
    }
  }, [context, data]);

  const initialize = async () => {
    console.log('init')
    try {
      const response = await getData(context.user.email);

      if (response && response.success) {
        setSelectedProfileNames(response.data.profiles.map(profile => profile.profileName));
        setTimeframe(response.data.timeframes[0]);
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to initialize user', err);
      throw new Error();
    }
  }

  const fetchMostRecentPostData = () => {
    console.log('fetching data');
    setFetchRecentData(false);

    context.userProfiles.map(async (profile) => {
      try {
        const response = (await API.graphql({
          query: populateAnalytics,
          variables: {
            username: context.user.email,
            profileKey: profile.key
          }
        })).data.populateAnalytics;
        
        console.log(`done fetching for ${profile.key}`);
        console.log(response)
  
        if (response.success && response.dataUpdated) {
          const response = await getData(context.user.email);
          if (response && response.success) {
            console.log('Updating')
            setData(response.data);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch most recent post data for ${profile.key}`, err);
      }
    });
  }

  const getData = async (username, timeframe, selectedProfileNames) => {
    const { startDate, endDate } = timeframe ?? {};
    const timezoneOffset = new Date().getTimezoneOffset();

    try {
      const response = (await API.graphql({
        query: getDataQuery,
        variables: {
          username,
          startDate,
          endDate,
          selectedProfileNames,
          timezoneOffset,
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

  const handleNeedsRefresh = React.useCallback((profile) => {
    setProfileToRefresh(profile)
  }, []);

  const handleRefresh = React.useCallback(() => {
    router.push(`/add-profile/${profileToRefresh.platform}`)
  }, [profileToRefresh]);

  const handleRefreshCancel = React.useCallback(() => {
    setProfileToRefresh(null);
  }, []);

  const getContent = () => {
    if (context.user && context.userProfiles && data) {
      return (
        <div className='container'>
          <Header user={context.user} goToAddPlatformSelection={goToAddPlatformSelection} signOut={context.signOut}/>
          <MainContentContainer
            data={data}
            profiles={context.userProfiles}
            selectedProfileNames={selectedProfileNames}
            timeframe={timeframe}
            setSelectedProfileNames={updateSelectedProfileName}
            setTimeframe={updateTimeFrame}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleNeedsRefresh={handleNeedsRefresh}
            handleRefresh={handleRefresh}
            handleRefreshCancel={handleRefreshCancel}
            profileToRefresh={profileToRefresh}
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
