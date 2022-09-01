import React from 'react';
import AggregatedStatsContainer from './AggregatedStatsContainer';
import PostsContainer from './PostsContainer';
import IndividualPostPopUp from './IndividualPostPopUp';
import ProfilePicker from './ProfilePicker';
import { Select, MenuItem, FormControl, InputLabel, Menu, IconButton } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';

import {
    getGraphData,
    getAggregatedStats,
} from '../data-manipulations';

import styles from '../styles/MainContentContainer.module.css';

const MainContentContainer = ({ data, goToAddPlatformSelection, signOut }) => {
    const timeframeNames = data.timeframes.map(timeframe => timeframe.name);
    const profileNames = data.profiles === null ? [] : data.profiles.map(profile => profile.profileName);

    const [state, setState] = React.useState({
        profiles: profileNames,
        timeframe: data.timeframes[0],
        popUpPost: null,
        profilePickerExpanded: true,
        settingsAnchorEl: null,
    });
    
    const handleProfileChange = React.useCallback((newValue) => {
        setState((prevState) => ({
            ...prevState,
            profiles: newValue,
        }));
    }, []);

    const handleTimeFrameChange = React.useCallback((event) => {
        const timeframeIndex = timeframeNames.indexOf(event.target.value);

        setState((prevState) => ({
            ...prevState,
            timeframe: data.timeframes[timeframeIndex],
        }));
    }, []);

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

    const openSettingsMenu = (event) => {
        setState((prevState) => ({
            ...prevState,
            settingsAnchorEl: event.currentTarget,
        }));
    };

    const closeSettingsMenu = () => {
        setState((prevState) => ({
            ...prevState,
            settingsAnchorEl: null,
        }));
    }

    const filterRecordsByTimeframeAndUsername = () => {
        const profileRecords = data.records.filter(record => state.profiles.includes(record.profileName));
        const partitionDate = state.timeframe.partitionDate;

        if (partitionDate === null) {
            return profileRecords;
        }
    
        return profileRecords.filter(record => (new Date(record.datePosted) > new Date(partitionDate)));
    }

    const selectedProfiles = data.profiles.filter(profile => (state.profiles.includes(profile.profileName)));
    const filteredRecords = filterRecordsByTimeframeAndUsername();
    const aggregatedData = getAggregatedStats(filteredRecords, data.metrics, selectedProfiles);
    const graphData = getGraphData(filteredRecords, [...state.timeframe.graphPartitions]);

    const getPostHeaders = () => {
        if (data.profiles === null) {
            return []
        }

        const globalHeaders = data.postHeaders.find((postHeader => postHeader.platform === 'global')).metrics;
        const platformHeaders = [];

        const selectedProfiles = data.profiles.filter(profile => (state.profiles.includes(profile.profileName)));
        const hasSinglePlatform = (new Set(selectedProfiles.map(profile => profile.platform)).size === 1);

        if (hasSinglePlatform) {
            const platform = data.profiles.find(profile => (profile.profileName === state.profiles[0])).platform;
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
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerLeftBanner}>
                        Digital Dash App {process.env.NEXTAUTH_URL}
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.headerRightContent}>
                        <div className={styles.headerRightContentName}>
                            Hi, Milan
                        </div>
                        <div className={styles.headerRightContentSettings}>
                            <IconButton onClick={openSettingsMenu}>
                                <SettingsOutlined fontSize="medium"/>
                            </IconButton>
                        </div>
                        <Menu
                            anchorEl={state.settingsAnchorEl}
                            open={state.settingsAnchorEl !== null}
                            onClose={closeSettingsMenu}>
                            <MenuItem onClick={goToAddPlatformSelection}>Add/Remove Accounts</MenuItem>
                            <MenuItem onClick={signOut}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentLeft} style={{
                    width: state.profilePickerExpanded ? '18%' : '3%',
                }}>
                    <div className={styles.contentLeftPicker}>
                        <ProfilePicker
                            profiles={data.profiles}
                            selectedProfileNames={state.profiles}
                            handleProfileClick={handleProfileChange}
                            expanded={state.profilePickerExpanded}
                            toggleExpanded={toggleProfilePickerExpanded}/>
                    </div>
                </div>
                <div className={styles.contentRight} style={{
                    width: state.profilePickerExpanded ? '82%' : '97%',
                }}>
                    <div className={styles.dropdown}>
                        <FormControl sx={{ m: 1, minWidth: 120, height: '100%' }}>
                            <InputLabel>Timeframe</InputLabel>
                            <Select
                                label="Timeframe"
                                value={state.timeframe.name}
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
                    <div className={styles.contentTop}>
                        <AggregatedStatsContainer
                            data={aggregatedData}/>
                    </div>
                    <div className={styles.contentBottom}>
                        <PostsContainer
                            posts={filteredRecords}
                            headers={getPostHeaders()}
                            profiles={data.profiles}
                            graphData={graphData}
                            openPopUp={setPopUpPost}/>
                    </div>
                </div>
            </div>
            {
                (state.popUpPost !== null) && [
                    (<div className={styles.popupBackground} onClick={clearPopUpPost}/>),
                    (<div className={styles.popup}>
                        <IndividualPostPopUp post={state.popUpPost} headers={data.postHeaders.find(header => (header.platform === data.profiles.find(profile => (profile.profileName === state.popUpPost.profileName)).platform)).metrics}/>
                    </div>)
                ]
            }
        </div>
    );
}

export default MainContentContainer;