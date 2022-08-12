import React from 'react';
import TabSwitchContainer from './TabSwitchContainer';
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

import '../styles/MainContentContainer.css';

const MainContentContainer = ({ data, goToAddPlatformSelection }) => {
    const timeframeNames = data.timeframes.map(timeframe => timeframe.name);
    const profileNames = data.profiles.map(profile => profile.username);

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
        const profileRecords = data.records.filter(record => state.profiles.includes(record.username));
        const partitionDate = state.timeframe.partitionDate;

        if (partitionDate === null) {
            return profileRecords;
        }
    
        return profileRecords.filter(record => (new Date(record['Date']) > new Date(partitionDate)));
    }

    const filteredRecords = filterRecordsByTimeframeAndUsername();
    const aggregatedData = getAggregatedStats(filteredRecords, data.metrics);
    const graphData = getGraphData(filteredRecords, [...state.timeframe.graphPartitions]);

    const getPostHeaders = () => {
        const selectedProfiles = data.profiles.filter(profile => (state.profiles.includes(profile.username)));
        return (new Set(selectedProfiles.map(profile => profile.platform)).size > 1 || state.profiles.length === 0)
            ? data.postHeaders['global']
            : data.postHeaders[data.profiles[data.profiles.findIndex(profile => (profile.username === state.profiles[0]))].platform]
    };

    return (
        <div className="MainContentContainer">
            <div className="MainContentContainer-header">
                <div className="MainContentContainer-header-left">
                    <div className="MainContentContainer-header-left-banner">
                        Digital Dash App
                    </div>
                </div>
                <div className="MainContentContainer-header-right">
                    <div className="MainContentContainer-header-right-content">
                        <div className="MainContentContainer-header-right-content-name">
                            Hi, Milan
                        </div>
                        <div className="MainContentContainer-header-right-content-settings">
                            <IconButton onClick={openSettingsMenu}>
                                <SettingsOutlined fontSize="medium"/>
                            </IconButton>
                        </div>
                        <Menu
                            anchorEl={state.settingsAnchorEl}
                            open={state.settingsAnchorEl !== null}
                            onClose={closeSettingsMenu}>
                            <MenuItem onClick={goToAddPlatformSelection}>Add/Remove Accounts</MenuItem>
                            <MenuItem>Sign Out</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className="MainContentContainer-content">
                <div className="MainContentContainer-content-left">
                    <div className="MainContentContainer-content-left-picker">
                        <ProfilePicker
                            profiles={data.profiles}
                            selectedProfileNames={state.profiles}
                            handleProfileClick={handleProfileChange}
                            expanded={state.profilePickerExpanded}
                            toggleExpanded={toggleProfilePickerExpanded}/>
                    </div>
                </div>
                <div className="MainContentContainer-content-right">
                    <div className="MainContentContainer-dropdown">
                        <div className="MainContentContainer-dropdown-btn">
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                    </div>
                    <div className="MainContentContainer-content-top">
                        <AggregatedStatsContainer
                            data={aggregatedData}/>
                    </div>
                    <div className="MainContentContainer-content-bottom">
                        <PostsContainer
                            posts={filteredRecords}
                            headers={getPostHeaders()}
                            graphData={graphData}
                            openPopUp={setPopUpPost}/>
                    </div>
                </div>
            </div>
            {
                (state.popUpPost !== null) && [
                    (<div className="MainContentContainer-popup-background" onClick={clearPopUpPost}/>),
                    (<div className="MainContentContainer-popup">
                        <IndividualPostPopUp post={state.popUpPost} headers={data.postHeaders[state.popUpPost.platform]}/>
                    </div>)
                ]
            }
        </div>
    );
}

export default MainContentContainer;