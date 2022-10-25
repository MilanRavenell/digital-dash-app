import React from 'react';
import { useRouter } from 'next/router';
import AddProfileSelection from '../components/AddProfileSelection';
import "@aws-amplify/ui-react/styles.css";
import { API } from 'aws-amplify';
import { deleteProfile } from '../aws/custom-gql';
import AppContext from '../components/AppContext';
import axios from "axios";
import Header from '../components/Header';
import Loading from '../components/Loading';

export default function Home() {
  const router = useRouter();
  const context = React.useContext(AppContext);
  const [profileToRefresh, setProfileToRefresh] = React.useState(null);

  const isFirstLogin = (router.query.f === 1);

  React.useEffect(() => {
    if (router.query.profiles !== undefined && context.userProfiles) {
      if (router.query.profiles === JSON.stringify(context.userProfiles)) {
        //  Clear query parameters from the URL
        router.push('/add-profile-selection');
        return;
      }

      const profiles = JSON.parse(router.query.profiles);
      context.setUserProfiles(profiles);
    }
  });

  const handleProfileDelete = React.useCallback(async (user, profiles, profileIndex) => {
    try {
      const response = await API.graphql({
        query: deleteProfile,
        variables: {
          username: user.email,
          profileKey: `${profiles[profileIndex].platform}_${profiles[profileIndex].profileName}`,
        }
      });

      const deletedProfile = profiles[profileIndex];

      const newProfiles = [...profiles];
      newProfiles.splice(profileIndex, 1);
      // If there are no more signed in instagram profiles, log the user out of facebook
      if (deletedProfile.platform === 'instagram-pro') {
        const { account_id, access_token } = JSON.parse(deletedProfile.meta);
        await axios.get(`/api/auth/sign-out-instagram?id=${account_id}&accessToken=${access_token}`);
      }

      if (deletedProfile.platform === 'youtube') {
        google.accounts.oauth2.revoke(JSON.parse(deletedProfile.meta).accessToken)
      }

      if (deletedProfile.platform === 'twitter') {
        await axios.get(`/api/auth/sign-out-twitter?accessToken=${JSON.parse(deletedProfile.meta).accessToken}`);
      }

      context.setUserProfiles(newProfiles);
    } catch (err) {
      console.log(`Failed to delete profile ${profiles[profileIndex].profileName}`, err)
    }
  });

  const navigateToMain = () => {
    router.push(`/`);
  }

  const navigateToPlatform = (platform) => {
    router.push(`/add-profile/${platform}`);
  }

  const handleNeedsRefresh = React.useCallback((profile) => {
    setProfileToRefresh(profile)
  }, []);

  const handleRefresh = React.useCallback(() => {
    router.push(`/add-profile/${profileToRefresh.platform.split('-')[0]}`);
  }, [profileToRefresh]);

  const handleRefreshCancel = React.useCallback(() => {
    setProfileToRefresh(null);
  }, []);

  const getContent = () => {
    if (context.user) {
      return [
        <Header
          user={context.user}
          signOut={context.signOut}
          key={'header'}
        />,
        <AddProfileSelection
          user={context.user}
          profiles={context.userProfiles}
          handleProfileDelete={handleProfileDelete}
          handlePlatformClick={navigateToPlatform}
          handleContinueClick={navigateToMain}
          isFirstLogin={isFirstLogin}
          handleNeedsRefresh={handleNeedsRefresh}
          handleRefresh={handleRefresh}
          handleRefreshCancel={handleRefreshCancel}
          profileToRefresh={profileToRefresh}
          windowDimensions={context.windowDimensions}
          key={'main'}
        />
      ]
    }
  
    return (
      <Loading/>
    )
  }

  return (
    <div className='container'>
    {
      getContent()
    }
    </div>
  )
  
}