import React from 'react';
import { useRouter } from 'next/router';
import AddProfileComponent from '../../components/AddProfile';
import "@aws-amplify/ui-react/styles.css";
import {
    Authenticator
  } from "@aws-amplify/ui-react";
  import { API } from 'aws-amplify';
  import { createUserProfile } from '../../graphql/mutations';
  import AppContext from '../../components/AppContext';

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
                profiles: JSON.stringify(response.map(({ data }) => data.createUserProfile)),
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