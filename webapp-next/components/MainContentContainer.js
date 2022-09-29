import React from 'react';
import AggregatedStatsContainer from './AggregatedStatsContainer';
import PostsContainer from './PostsContainer';
import IndividualPostPopUp from './IndividualPostPopUp';
import ProfilePicker from './ProfilePicker';
import DatePicker from './DatePicker';
import PostsContainerPostsView from './PostsContainerPostsView';
import PostsContainerGraphView from './PostsContainerGraphView';
import { Select, MenuItem, FormControl, InputLabel, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Popover from '@mui/material/Popover';
import NeedsRefreshDialogue from './NeedsRefreshDialogue';
import moment from 'moment';

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
    const timeframeNames = data.timeframes.map(timeframe => timeframe.name);

    const [state, setState] = React.useState({
        popUpPost: null,
        profilePickerExpanded: true,
    });

    const popoverAnchorEl = React.useRef();
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [bottomView, setBottomView] = React.useState('graph');

    const handleTimeFrameChange = React.useCallback((event) => {
        const value = event.target.value;

        if (value === 'Custom') {
            setPopoverOpen(true);
        }

        const timeframeIndex = timeframeNames.indexOf(event.target.value);
        setTimeframe(data.timeframes[timeframeIndex]);
    }, []);

    const handleCustomTimeframe = React.useCallback((startDate, endDate) => {
        setPopoverOpen(false);
        setTimeframe({
            name: 'CustomSelected',
            startDate,
            endDate,
        });
    }, []);

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    }

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
                    <div className={styles.date}>
                        <div className={styles.dateLabel}>
                            {
                                (timeframe.startDate && timeframe.endDate)
                                && `${moment(timeframe.startDate).format('MMM D, YYYY') } - ${moment(timeframe.endDate).format('MMM D, YYYY')}`
                            }
                        </div>
                        <FormControl sx={{ m: 1, minWidth: 120, height: '100%' }} ref={popoverAnchorEl}>
                            <InputLabel>Timeframe</InputLabel>
                            <Select
                                label="Timeframe"
                                value={timeframe.name}
                                onChange={handleTimeFrameChange}
                            >
                            {
                                data.timeframes.map((timeframe, index) => (
                                    <MenuItem value={timeframe.name} key={index}>{timeframe.name}</MenuItem>
                                ))
                            }
                            </Select>
                        </FormControl>
                    </div>
                    <Popover
                        open={popoverOpen}
                        anchorEl={popoverAnchorEl.current}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <DatePicker submit={handleCustomTimeframe}/>
                    </Popover>
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
                    (<div className={styles.popupBackground} onClick={clearPopUpPost}/>),
                    (<div className={styles.popup}>
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