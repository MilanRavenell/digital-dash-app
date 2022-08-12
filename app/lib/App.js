import React from 'react';
import logo from './logo.svg';
import '../styles/App.css';
import MainContentContainer from './MainContentContainer';
import SignIn from './SignIn';
import AddPlatformSelection from './AddPlatformSelection';
import AddPlatform from './AddPlatform';
import axios from "axios";

const App = () => {
  const [state, setState] = React.useState({
    user: null,
    data: null,
    signUpMode: false,
    screen: 'sign-in'
  });

  React.useEffect(() => {
    if (state.user !== null && state.data === null) {
      axios.get(`http://localhost:8000/get-data?username=${state.user}`).then((response) => {
        if (response.data) {
          setState({
            ...state,
            data: response.data,
            screen: 'main-content',
          });
        }
      });
    } 
    
    if (state.screen === 'loading' && state.user != null && state.data !== null) {
      console.log('fuck')
      setState({
        ...state,
        screen: 'main-content',
      });
    }
  });

  const attemptSignIn = React.useCallback((username, password) => {
    axios.get(`http://localhost:8000/verify-user?username=${username}&pass=${password}`).then((response) => {
      if (response.data) {
        setState((prevState) => ({
          ...prevState,
          user: username,
          screen: 'loading',
        }));
      }
    });
  }, []);

  const initUser = React.useCallback((username, password) => {
    axios.get(`http://localhost:8000/init-user?username=${username}&pass=${password}`).then((response) => {
      if (response.data) {
        setState((prevState) => ({
          ...prevState,
          screen: 'add-platform-selection',
          user: username,
        }));
      }
    });
  }, []);

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

  const addPlatformAccount = React.useCallback((username, platform) => {
    axios.get(`http://localhost:8000/update-user?username=${state.user}&${platform}_user=${username}`).then((response) => {
      setState((prevState) => ({
        ...prevState,
        screen: 'add-platform-selection',
      }));
    });

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
      case 'sign-in':
        return (<SignIn handleSubmit={attemptSignIn} handleSignUp={initUser}/>);
      case 'add-platform-selection':
        return (<AddPlatformSelection handlePlatformSelected={goToAddPlatform} handleContinue={finishSignUp} currentProfiles={ state.data !== null ? state.data.profiles : []}/>);
      case 'add-platform':
        return (<AddPlatform platform={state.addPlatform} handleSubmit={addPlatformAccount}/>);
      case 'loading':
        return 'Loading';
      case 'main-content':
        return (<MainContentContainer user={state.user} data={state.data} goToAddPlatformSelection={goToAddPlatformSelection}/>)
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
