import React from 'react';
import { useRouter } from 'next/router';
import AddProfileComponent from '../../components/AddProfile';
import "@aws-amplify/ui-react/styles.css";
import { API } from 'aws-amplify';
import { createUserProfile, updateUserProfile, createProfile, updateProfiles } from '../../aws/graphql/mutations';
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
    const { success, profiles: finalProfiles } = (await API.graphql({
        query: updateProfiles,
        variables: {
            input: {
                owner: user.owner,
                profiles: JSON.stringify(profiles.map(profile => ({
                    ...profile,
                    key: `${profile.platform}_${profile.profileName}`,
                }))),
            },
        },
    })).data.updateProfiles;

    if (success) {
        context.setUserProfiles(finalProfiles);
    } else {
        console.error('Failed to update user profiles, see cloudwatch for more information');
    }

    router.push({
        pathname: `/add-profile-selection`,
    });
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