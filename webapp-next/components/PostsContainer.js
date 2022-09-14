import React from 'react';
import TabSwitchContainer from './TabSwitchContainer';
import PostsContainerPostsView from './PostsContainerPostsView';
import PostsContainerGraphView from './PostsContainerGraphView';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import styles from '../styles/PostsContainer.module.css'

const PostsContainer = ({
    posts,
    headers,
    profiles,
    graphData,
    openPopUp,
    sortOrder,
    setSortOrder,
}) => {
    const views = ['graph', 'posts'];

    const [state, setState] = React.useState({
        view: views[0],
    });
    
    const handleViewChange = React.useCallback((element) => {
        setState((prevState) => ({
            ...prevState,
            view: element.target.value,
        }));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.dropdown}>
                <div className={styles.dropdownBtn}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>View</InputLabel>
                        <Select
                            label="View"
                            value={state.view}
                            onChange={handleViewChange}
                        >
                            <MenuItem value={'posts'}>Posts</MenuItem>
                            <MenuItem value={'graph'}>Graph</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            {
                state.view === 'posts'
                    ? <PostsContainerPostsView
                        posts={posts}
                        headers={headers}
                        profiles={profiles}
                        openPopUp={openPopUp}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}/>
                    : <PostsContainerGraphView graphData={graphData}/>
            }
        </div>
    );
}

export default PostsContainer;