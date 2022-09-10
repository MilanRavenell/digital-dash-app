import React from 'react';
import { useRouter } from 'next/router';
import AddProfileSelection from '../components/AddProfileSelection';
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify';
import { deleteUserProfile } from '../aws/graphql/mutations';
import AppContext from '../components/AppContext';
import axios from "axios";
import Header from '../components/Header';

export default function Home() {
  const router = useRouter();
  const context = React.useContext(AppContext);
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const { user: authUser, signOut } = useAuthenticator((context) => [context.user]);

  const isFirstLogin = (router.query.f === 1);

  React.useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/sign-in')
    }

    if (authStatus === 'configuring') {
      return;
    }

    context.setUserCallback(authUser);

    // Append any new profiles sent in the URL query field from add-profiles
    if (router.query.profiles !== undefined && context.userProfiles) {
      const profiles = JSON.parse(router.query.profiles);

      const prevProfileNames = context.userProfiles.map(({ profileName }) => profileName);
      const filteredProfiles = profiles
        .filter(({ profileName }) => !prevProfileNames.includes(profileName));

      if (filteredProfiles.length > 0) {
        context.setUserProfiles(
          context.userProfiles.concat(
            filteredProfiles,
          ),
        );
      } else {
        //  Clear query parameters from the URL
        router.push('/add-profile-selection')
      }
    }
  });

  const handleProfileDelete = React.useCallback(async (user, profiles, profileIndex) => {
    try {
      const response = await API.graphql({
        query: deleteUserProfile,
        variables: {
          input: {
            user: user.email,
            profileName: profiles[profileIndex].profileName,
          }
        }
      });

      console.log(response);
      const deletedProfile = response.data.deleteUserProfile;

      const newProfiles = [...profiles];
      newProfiles.splice(profileIndex, 1);
      console.log(newProfiles)

      // If there are no more signed in instagram profiles, log the user out of facebook
      if (deletedProfile.platform === 'instagram') {
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

  if (context.user) {
    return (
      <div className='container'>
        <Header user={context.user} signOut={signOut}/>
        <AddProfileSelection
          user={context.user}
          profiles={context.userProfiles}
          handleProfileDelete={handleProfileDelete}
          handlePlatformClick={navigateToPlatform}
          handleContinueClick={navigateToMain}
          isFirstLogin={isFirstLogin}
        />
      </div>
    )
  }

  return (
    <div className='container'>Loading</div>
  )
  
}