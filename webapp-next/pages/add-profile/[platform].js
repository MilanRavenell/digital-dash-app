import React from 'react';
import { useRouter } from 'next/router';
import AddProfileComponent from '../../components/AddProfile';
import "@aws-amplify/ui-react/styles.css";
import {
    Authenticator
  } from "@aws-amplify/ui-react";
  import { API } from 'aws-amplify';
  import { createUserProfile } from '../../aws/graphql/mutations';
  import AppContext from '../../components/AppContext';
  import { platformLoginHandlers, platformLoginCallbackHandlers } from '../../helpers';

export async function getStaticPaths() {
  return {
    paths: [
      { params: { platform: 'twitter' } },
      { params: { platform: 'youtube' } },
      { params: { platform: 'instagram' } },
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

    const handleSubmit = React.useCallback(async (user, profiles, platform) => {
        try {
            const response = await Promise.all(profiles.map(profile => API.graphql({
                query: createUserProfile,
                variables: {
                    input: {
                        user: user.email,
                        platform,
                        profileName: profile.profileName,
                        meta: profile.meta,
                    },
                }
            })));

            router.push({
              pathname: `/add-profile-selection`,
              query: {
                profiles: JSON.stringify(response.map(({ data }, index) => ({
                  ...data.createUserProfile,
                  profilePicUrl: profiles[index].profilePicUrl,
                }))),
              }
            });
        } catch (err) {
          console.error(`Failed to add platform ${platform} for user ${user}`, err);
          router.push(`/add-profile-selection`);
        }
    }, []);

    const cancel = () => {
      router.push(`/add-profile-selection`);
    };

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

              return(
                <div className='container'>
                  <AddProfileComponent
                      user={user.attributes}
                      currentProfiles={context.userProfiles}
                      platform={platform}
                      loginHandler={platformLoginHandlers[platform]}
                      loginCallbackHandler={platformLoginCallbackHandlers[platform]}
                      handleSubmit={handleSubmit}
                      cancel={cancel}
                  />
                </div>
              )
              
            }}
        </Authenticator>
    );
}

export default AddProfile;