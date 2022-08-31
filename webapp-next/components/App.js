import React from 'react';
import MainContentContainer from './MainContentContainer';
import AddPlatformSelection from './AddProfileSelection';
import AddProfile from './AddProfile';
import { API } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { createUser, createUserProfile } from '../aws/graphql/mutations';
import { getData, populateAnalytics } from '../aws/custom-gql';
import { useRouter } from 'next/router';

const App = ({ signOut, authUser }) => {
  const [state, setState] = React.useState({
    user: null,
    data: null,
    signUpMode: false,
    screen: 'loading',
    fetchRecentData: false,
  });

  const router = useRouter();

  React.useEffect(async () => {
    if (state.user === null) {
      await handleLogIn();
      return;
    }
    
    if (state.screen === 'loading' && state.data !== null) {
      setState({
        ...state,
        screen: 'main-content',
      });
      return;
    }

    if (state.screen === 'main-content' && state.fetchRecentData) {
      await fetchMostRecentPostData();
      return;
    }
  });

  const handleLogIn = async () => {
    try {
      let user = (await API.graphql({ query: getUser, variables: { email: authUser.attributes.email }})).data.getUser;

      if (user === null) {
        user = {
          email: authUser.attributes.email,
          firstName: authUser.attributes.given_name,
          lastName: authUser.attributes.family_name,
        }

        await API.graphql({ query: createUser, variables: { input: user }});

        setState({
          ...state,
          user,
          screen: 'add-platform-selection',
        });

        return;
      }

      const response = (await API.graphql({
        query: getData,
        variables: {
          username: user.email
        }
      })).data.getData;

      console.log(response.data)

      if (response.success) {
        setState({
          ...state,
          user,
          data: response.data,
          screen: 'main-content',
          fetchRecentData: true,
        });
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
          username: state.user.email
        }
      })).data.populateAnalytics;
      
      console.log('done fetching');
      console.log(response)

      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            records: response.dataUpdated ? response.data : prevState.data.records,
          },
          fetchRecentData: false,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch most recent post data', err);
    }
  }

  const goToAddPlatformSelection = React.useCallback(() => {
    router.push(`/add-profile-selection`);
  }, []);

  const goToAddPlatform = React.useCallback((platform) => {
    setState((prevState) => ({
      ...prevState,
      screen: 'add-platform',
      addPlatform: platform,
    }));
  }, []);

  const addPlatformAccount = React.useCallback((profiles, platform) => {
    try {
      Promise.all(profiles.map(profile => API.graphql({
        query: createUserProfile,
        variables: {
          input: {
            user: state.user.email,
            platform,
            profileName: profile.profileName,
            meta: profile.meta,
          }
        }
      }))).then((response) => {
        console.log(response)
        setState((prevState) => ({
          ...prevState,
          screen: 'add-platform-selection',
          data: {
            ...prevState.data,
            profiles: prevState.data.profiles.concat(response.map(({ data }) => data.createUserProfile)),
          }
        }));
      });
    } catch (err) {
      console.error(`Failed to add platform ${platform} for user ${user}`)
    }
    

  }, [state]);

  const finishSignUp = React.useCallback(() => {
    // axios.get(`http://localhost:8000/run-scrapers?username=${state.user}`)

    setState((prevState) => ({
      ...prevState,
      screen: 'loading',
    }));
  }, [state]);

  const getContent = () => {
    switch(state.screen) {
      case 'add-platform-selection':
        return (
          <AddPlatformSelection 
            handlePlatformSelected={goToAddPlatform}
            handleContinue={finishSignUp}
            currentProfiles={ state.data !== null ? state.data.profiles : [] }
            handleProfileDelete={deleteProfile}
          />
        );
      case 'add-platform':
        console.log('addprofile', AddProfile)
        return (<AddProfile platform={state.addPlatform} handleSubmit={addPlatformAccount} cancel={goToAddPlatformSelection}/>);
      case 'loading':
        return 'Loading';
      case 'main-content':
        return (<MainContentContainer user={state.user} data={state.data} goToAddPlatformSelection={goToAddPlatformSelection} signOut={signOut}/>)
    }
  }
  

  return getContent();
}

export default App;
