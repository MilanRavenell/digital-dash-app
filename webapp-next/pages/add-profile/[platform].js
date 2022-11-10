import React from 'react';
import { useRouter } from 'next/router';
import AddProfileComponent from '../../components/AddProfile';
import "@aws-amplify/ui-react/styles.css";
import { API } from 'aws-amplify';
import { createUserProfile, updateUserProfile } from '../../aws/graphql/mutations';
import AppContext from '../../components/AppContext';
import { platformLoginHandlers, platformLoginCallbackHandlers } from '../../helpers';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import axios from "axios";

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

    React.useEffect(() => {
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

      const profilesToAdd = profiles
        .filter((profile, index) => (profileIndicesToModify[index] === -1));

      // Update profiles that already exist
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
      
        // Add new profiles
        const response = await Promise.all(profilesToAdd.map(async profile => {
          const profileKey = `${profile.platform}_${profile.profileName}`;
          const createUserProfileResponse = await API.graphql({
            query: createUserProfile,
            variables: {
                input: {
                    user: user.email,
                    key: profileKey,
                    owner: user.owner,
                    platform: profile.platform,
                    profileName: profile.profileName,
                    meta: profile.meta,
                    profilePicUrl: profile.profilePicUrl,
                },
            }
          });

          // Trigger populateAnalytics
          await axios.get(`/api/send-populate-analytics-sqs?username=${user.email}&profileKey=${profileKey}`);

          return createUserProfileResponse;
        }));

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

    const navigateToHomepage = () => {
      router.push('/homepage');
    }

    const navigateToPrivacyPolicy = () => {
      router.push('/privacy-policy');
    }

    const getContent = () => {
      if (context.user  && !context.loading) {
        return [
            <Header
              user={context.user}
              signOut={context.signOut}
              deleteAccount={context.deleteUserCallback}
              onLogoClick={navigateToHomepage}
              key={'header'}
            />,
            <AddProfileComponent
                user={context.user}
                currentProfiles={context.userProfiles}
                platform={platform}
                loginHandlers={platformLoginHandlers[platform]}
                loginCallbackHandler={platformLoginCallbackHandlers[platform]}
                handleSubmit={handleSubmit}
                navigateToPrivacyPolicy={navigateToPrivacyPolicy}
                cancel={cancel}
                key={'main'}
            />
        ];
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

export default AddProfile;