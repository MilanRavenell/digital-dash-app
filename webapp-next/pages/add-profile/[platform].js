import React from 'react';
import { useRouter } from 'next/router';
import AddProfileComponent from '../../components/AddProfile';
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
  import { API } from 'aws-amplify';
  import { createUserProfile, updateUserProfile } from '../../aws/graphql/mutations';
  import AppContext from '../../components/AppContext';
  import { platformLoginHandlers, platformLoginCallbackHandlers } from '../../helpers';
  import Header from '../../components/Header';

export async function getStaticPaths() {
  return {
    paths: [
      { params: { platform: 'twitter' } },
      { params: { platform: 'youtube' } },
      { params: { platform: 'instagram' } },
      { params: { platform: 'tiktok' } },
    ],
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context) {
  return {
    // Passed to the page component as props
    props: { platform: {} },
  }
}


const AddProfile = () => {
    const router = useRouter();
    const { platform } = router.query;
    const context = React.useContext(AppContext);

    const { authStatus } = useAuthenticator(context => [context.authStatus]);
    const { user: authUser, signOut } = useAuthenticator((context) => [context.user]);

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
  })

    const handleSubmit = React.useCallback(async (user, profiles) => {
      const newContextProfiles = [...context.userProfiles];

      const profileIndicesToModify = profiles
        .map(
          profile => context.userProfiles.findIndex(
            contextProfile => (contextProfile.key === `${profile.platform}_${profile.profileName}`)
          )
        );

      const profilesToAdd = profileIndicesToModify
        .filter(profileIndex => (profileIndex === -1));

      try {
        await Promise.all(
          profileIndicesToModify
            .map(async (contextProfileIndex, newProfileIndex) => {
              if (contextProfileIndex === -1) {
                return;
              }

              // Update DDB item
              const response = await API.graphql({
                query: updateUserProfile,
                variables: {
                  input: {
                    user: user.email,
                    key: newContextProfiles[contextProfileIndex].key,
                    meta: profiles[newProfileIndex].meta,
                    needsRefresh: false,
                  },
                },
              });

              newContextProfiles[contextProfileIndex] = response.data.updateUserProfile;
            })
        );
      
        const response = await Promise.all(profilesToAdd.map(profile => API.graphql({
            query: createUserProfile,
            variables: {
                input: {
                    user: user.email,
                    key: `${profile.platform}_${profile.profileName}`,
                    platform: profile.platform,
                    profileName: profile.profileName,
                    meta: profile.meta,
                    profilePicUrl: profile.profilePicUrl,
                },
            }
        })));

        response.map(({ data }) => {
          newContextProfiles.push(data.createUserProfile);
        });

        router.push({
          pathname: `/add-profile-selection`,
          query: {
            profiles: JSON.stringify(newContextProfiles),
          }
        });
      } catch (err) {
        console.error(`Failed to add platform ${platform} for user ${user.email}`, err);
        router.push(`/add-profile-selection`);
      }
    }, [context]);

    const cancel = () => {
      router.push(`/add-profile-selection`);
    };

    if (context.user) {
      return (
        <div className='container'>
          <Header user={context.user} signOut={signOut}/>
          <AddProfileComponent
              user={context.user}
              currentProfiles={context.userProfiles}
              platform={platform}
              loginHandlers={platformLoginHandlers[platform]}
              loginCallbackHandler={platformLoginCallbackHandlers[platform]}
              handleSubmit={handleSubmit}
              cancel={cancel}
          />
        </div>
      );
    }

    return (
      <div className='container'>Loading</div>
    )
}

export default AddProfile;