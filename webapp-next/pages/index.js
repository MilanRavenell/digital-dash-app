import React from 'react';
import Header from '../components/Header';
import AppContext from '../components/AppContext';
import MainContentContainer from '../components/MainContentContainer';
import Loading from '../components/Loading';
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
  const [selectedProfileNames, setSelectedProfileNames] = React.useState([]);
  const [timeframe, setTimeframe] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(null);
  const [profileToRefresh, setProfileToRefresh] = React.useState(null);
  const [profilesUpdated, setProfilesUpdated] = React.useState(0);

  const selectedProfileNamesRef = React.useRef(selectedProfileNames);
  const timeframeRef = React.useRef(timeframe);
  const profilesUpdatedRef = React.useRef(profilesUpdated);

  React.useEffect(() => {
    if (context.user) {
      initialize();
    }
  }, [context]);

  React.useEffect(() => {
    selectedProfileNamesRef.current = selectedProfileNames;
    timeframeRef.current = timeframe;
    profilesUpdatedRef.current = profilesUpdated;
  }, [selectedProfileNames, timeframe, profilesUpdated]);

  React.useEffect(() => {
    if (profilesUpdated > 0) {
      const currentProfilesUpdated = profilesUpdated
      setTimeout(() => {
        if (currentProfilesUpdated === profilesUpdatedRef.current) {
          getData(
            context.user.email,
            timeframeRef.current,
            selectedProfileNamesRef.current,
          ).then(newData => {
            if (newData.success) {
              setData(newData.data);
            }
          });
  
          setProfilesUpdated(0);
        }
      }, 2000);
    }
  }, [profilesUpdated])

  const initialize = async () => {
    console.log('init')
    try {
      const response = await getData(context.user.email);

      if (response && response.success) {
        setSelectedProfileNames(response.data.profiles.map(profile => profile.profileName ));
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

  // Put stat containers in shimmering state
  const setStatsLoading = () => {
    if (data !== null) {
      setData((prevData) => ({
        ...prevData,
        aggregated: {
          ...prevData.aggregated,
          stats: prevData.aggregated.stats.map((stat) => ({ name: 'loading' })),
        }
      }))
    }
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
    setSelectedProfileNames(newSelectedProfileNames);
    setProfilesUpdated((prev) => prev + 1);
    setStatsLoading();
  }, [data]);

  const updateTimeFrame = React.useCallback(async (newTimeframe) => {
    console.log('selected profiles: ', selectedProfileNamesRef.current)

    if (!newTimeframe.startDate || !newTimeframe.endDate) {
      setTimeframe(newTimeframe);
      return;
    }

    setStatsLoading();

    const newData = await getData(
      context.user.email,
      newTimeframe,
      selectedProfileNamesRef.current,
    );

    if (newData.success) {
      setData(newData.data);
      setTimeframe(newTimeframe);
    }
  }, [context, selectedProfileNames, timeframe, setTimeframe, setData, data]);

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
      return [
          <Header
            user={context.user}
            goToAddPlatformSelection={goToAddPlatformSelection}
            signOut={context.signOut}
            key={'header'}
          />,
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
            isMobile={context.windowDimensions.width < 600}
            key={'main'}
          />
      ]
    }

    return (
      <Loading/>
    )
  }

  return  (
    <div className='container'>
    {
      getContent()
    }
    </div>
  );
}
