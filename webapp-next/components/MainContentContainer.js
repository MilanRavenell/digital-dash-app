import React from 'react';
import AggregatedStatsContainer from './AggregatedStatsContainer';
import PostsContainer from './PostsContainer';
import IndividualPostPopUp from './IndividualPostPopUp';
import ProfilePicker from './ProfilePicker';
import Header from './Header';
import { Select, MenuItem, FormControl, InputLabel, Menu, IconButton } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';

import styles from '../styles/MainContentContainer.module.css';

const MainContentContainer = ({
    data,
    selectedProfileNames,
    timeframe,
    setSelectedProfileNames,
    setTimeframe,
}) => {
    const timeframeNames = data.timeframes.map(timeframe => timeframe.name);

    const [state, setState] = React.useState({
        popUpPost: null,
        profilePickerExpanded: true,
    });

    const handleTimeFrameChange = React.useCallback((event) => {
        const timeframeIndex = timeframeNames.indexOf(event.target.value);
        setTimeframe(data.timeframes[timeframeIndex]);
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

    const aggregatedData = data.aggregated
    const graphData = data.graph;

    const getPostHeaders = () => {
        if (data.profiles === null) {
            return []
        }

        const globalHeaders = data.postHeaders.find((postHeader => postHeader.platform === 'global')).metrics;
        const platformHeaders = [];

        const selectedProfiles = data.profiles.filter(profile => (selectedProfileNames.includes(profile.profileName)));
        const hasSinglePlatform = (new Set(selectedProfiles.map(profile => profile.platform)).size === 1);

        if (hasSinglePlatform) {
            const platform = data.profiles.find(profile => (profile.profileName === selectedProfileNames[0])).platform;
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
                            profiles={data.profiles}
                            selectedProfileNames={selectedProfileNames}
                            handleProfileClick={setSelectedProfileNames}
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
                    <div className={styles.contentTop}>
                        <AggregatedStatsContainer
                            data={aggregatedData}/>
                    </div>
                    <div className={styles.contentBottom}>
                        <PostsContainer
                            posts={data.records}
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