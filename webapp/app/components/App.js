import React from 'react';
import '../styles/App.css';
import MainContentContainer from './MainContentContainer';
import SignIn from './SignIn';
import AddPlatformSelection from './AddPlatformSelection';
import AddProfile from './AddProfile';
import axios from "axios";
import { API } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { createUser, createUserProfile, deleteUserProfile } from '../graphql/mutations';
import { getData } from '../custom-gql'

const App = ({ signOut, authUser }) => {
  const [state, setState] = React.useState({
    user: null,
    data: null,
    signUpMode: false,
    screen: 'loading'
  });

  React.useEffect(() => {
    console.log(FB)
    if (state.user === null) {
      handleLogIn();
    }
    
    if (state.screen === 'loading' && state.data !== null) {
      console.log('fuck')
      setState({
        ...state,
        screen: 'main-content',
      });
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
        });
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      throw new Error();
    }
  }

  const goToAddPlatformSelection = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      screen: 'add-platform-selection',
    }));
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

  const deleteProfile = React.useCallback((profileIndex) => {
    try {
      API.graphql({
        query: deleteUserProfile,
        variables: {
          input: {
            user: state.user.email,
            profileName: state.data.profiles[profileIndex].profileName,
          }
        }
      }).then((response) => {
        const newProfiles = [...state.data.profiles]
        newProfiles.splice(profileIndex, 1);


        // If there are no more signed in instagram profiles, log the user out of facebook
        if (newProfiles.findIndex(profile => (profile.platform === 'instagram')) === -1) {
          FB.logout((response) => {
            console.log('logging out fb')
            console.log(response);
          });
        }
        
        setState((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            profiles: newProfiles,
          }
        }));
      })
    } catch (err) {
      console.log(`Failed to delete profile ${profile.profileName}`)
    }
  });

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
  

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      { getContent() }
    </div>
  );
}

export default App;
