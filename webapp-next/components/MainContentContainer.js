import React from 'react';
import AggregatedStatsContainer from './AggregatedStatsContainer';
import IndividualPostPopUp from './IndividualPostPopUp';
import ProfilePicker from './ProfilePicker';
import PostsContainerPostsView from './PostsContainerPostsView';
import PostsContainerGraphView from './PostsContainerGraphView';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import NeedsRefreshDialogue from './NeedsRefreshDialogue';
import TimeframePicker from './TimeframePicker';

import styles from '../styles/MainContentContainer.module.css';

const MainContentContainer = ({
    data,
    profiles,
    selectedProfileNames,
    timeframe,
    setSelectedProfileNames,
    setTimeframe,
    sortOrder,
    setSortOrder,
    handleNeedsRefresh,
    handleRefresh,
    handleRefreshCancel,
    profileToRefresh,
}) => {
    const [state, setState] = React.useState({
        popUpPost: null,
        profilePickerExpanded: true,
    });

    const [bottomView, setBottomView] = React.useState('graph');

    const setPopUpPost = React.useCallback((post) => {
        setState((prevState) => ({
            ...prevState,
            popUpPost: post,
        }));
    }, []);

    const clearPopUpPost = () => {
        setState((prevState) => ({
            ...prevState,
            popUpPost: null,
        }))
    };

    const toggleProfilePickerExpanded = React.useCallback(() => {
        setState(prevState => ({
            ...prevState,
            profilePickerExpanded: !prevState.profilePickerExpanded,
        }))
    }, []);

    const handleBottomViewChange = (event, newValue) => {
        setBottomView(newValue)
    }

    const aggregatedData = data.aggregated
    const graphData = data.graphs;

    const getPostHeaders = () => {
        if (profiles === null) {
            return []
        }

        const globalHeaders = data.postHeaders.find((postHeader => postHeader.platform === 'global')).metrics;
        const platformHeaders = [];

        const selectedProfiles = profiles.filter(profile => (selectedProfileNames.includes(profile.profileName)));
        const hasSinglePlatform = (new Set(selectedProfiles.map(profile => profile.platform)).size === 1);

        if (hasSinglePlatform) {
            const platform = profiles.find(profile => (profile.profileName === selectedProfileNames[0])).platform;
            platformHeaders.push(
                ...data.postHeaders.find((postHeader => postHeader.platform === platform)).metrics
            );
        }
        
        return {
            globalHeaders,
            platformHeaders,
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.contentLeft} style={{
                    width: state.profilePickerExpanded ? '18%' : '3%',
                }}>
                    <div className={styles.contentLeftPicker}>
                        <ProfilePicker
                            profiles={profiles}
                            selectedProfileNames={selectedProfileNames}
                            handleProfileClick={setSelectedProfileNames}
                            expanded={state.profilePickerExpanded}
                            toggleExpanded={toggleProfilePickerExpanded}
                            handleNeedsRefresh={handleNeedsRefresh}
                        />
                    </div>
                </div>
                <div className={styles.contentRight} style={{
                    width: state.profilePickerExpanded ? '82%' : '97%',
                }}>
                    <TimeframePicker
                        timeframes={data.timeframes}
                        timeframe={timeframe}
                        setTimeframe={setTimeframe}
                    />
                    <div className={styles.contentTop}>
                        <AggregatedStatsContainer
                            data={aggregatedData}/>
                    </div>
                    <div className={styles.contentBottom}>
                        <div className={styles.viewPicker}>
                            <ToggleButtonGroup
                                color="primary"
                                aria-label="button group"
                                exclusive
                                onChange={handleBottomViewChange}
                                value={bottomView}
                            >
                                <ToggleButton value="graph">
                                    <AssessmentOutlinedIcon/>
                                </ToggleButton>
                                <ToggleButton value="posts">
                                    <FormatListBulletedOutlinedIcon/>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        {
                            bottomView === 'posts'
                                ? <PostsContainerPostsView
                                    posts={data.records}
                                    headers={getPostHeaders()}
                                    profiles={profiles}
                                    openPopUp={setPopUpPost}
                                    sortOrder={sortOrder}
                                    setSortOrder={setSortOrder}/>
                                : <PostsContainerGraphView graphData={graphData}/>
                        }
                    </div>
                </div>
            </div>
            {
                (state.popUpPost !== null) && [
                    (<div className={styles.popupBackground} onClick={clearPopUpPost} key={'background'}/>),
                    (<div className={styles.popup} key={'pop-up'}>
                        <IndividualPostPopUp
                            post={state.popUpPost}
                            headers={
                                data
                                    .postHeaders
                                    .find(header => (
                                        header.platform ===
                                        data
                                            .profiles
                                            .find(profile => (
                                                profile.profileName === state.popUpPost.profileName
                                            ))
                                            .platform
                                    ))
                                    .metrics
                            }
                            />
                    </div>)
                ]
            }
            <NeedsRefreshDialogue
                open={profileToRefresh !== null}
                handleConfirm={handleRefresh}
                handleClose={handleRefreshCancel}
            />
        </div>
    );
}

export default MainContentContainer;