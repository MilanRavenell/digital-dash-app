import React from 'react';
import { useRouter } from 'next/router';
import AddProfileSelection from '../components/AddProfileSelection';
import "@aws-amplify/ui-react/styles.css";
import {
    Authenticator
} from "@aws-amplify/ui-react";
import { API, googleSignInButton } from 'aws-amplify';
import { deleteUserProfile } from '../aws/graphql/mutations';
import AppContext from '../components/AppContext';
import { Google } from '@mui/icons-material';
import axios from "axios";
import { signOut } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const context = React.useContext(AppContext);

  React.useEffect(() => {
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
        router.push('/add-profile-selection')
      }
    }
  })

  const handleProfileDelete = React.useCallback(async (user, profiles, profileIndex) => {
    try {
      await API.graphql({
        query: deleteUserProfile,
        variables: {
          input: {
            user: user.email,
            profileName: profiles[profileIndex].profileName,
          }
        }
      });

      const newProfiles = [...profiles];
      newProfiles.splice(profileIndex, 1);
      console.log(newProfiles)

      // If there are no more signed in instagram profiles, log the user out of facebook
      if (newProfiles.findIndex(profile => (profile.platform === 'instagram')) === -1) {
        FB.logout((response) => {
          console.log('logging out fb')
          console.log(response);
        });
      }

      if (profiles[profileIndex].platform === 'youtube') {
        google.accounts.oauth2.revoke(JSON.parse(profiles[profileIndex].meta).accessToken)
      }

      if (profiles[profileIndex].platform === 'twitter') {
        signOut({ redirect: false })
        await axios.get(`/api/auth/sign-out-twitter?accessToken=${JSON.parse(profiles[profileIndex].meta).accessToken}`);
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

  const authenticatorFormFields = {
    signUp: {
      given_name: {
        order:1,
        placeholder: 'First Name',
      },
      family_name: {
        order: 2,
        placeholder: 'Last Name',
      },
      email: {
        order: 4
      },
      password: {
        order: 5
      },
      confirm_password: {
        order: 6
      }
    },
  };

  return (
    <Authenticator formFields={authenticatorFormFields}>
      {({ user }) => {
        context.setUserCallback(user);

        return (
          <div className='container'>
            <AddProfileSelection
              user={user.attributes}
              profiles={context.userProfiles}
              handleProfileDelete={handleProfileDelete}
              handlePlatformClick={navigateToPlatform}
              handleContinueClick={navigateToMain}
            />
          </div>
        )
      }}
    </Authenticator>
  )
}