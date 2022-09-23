import React from 'react';
import { platformToLogoUrlMap } from '../helpers';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import styles from '../styles/PostsContainerPostsView.module.css';

const PostsContainerPostsView = ({
    posts,
    headers,
    profiles,
    openPopUp,
    sortOrder,
    setSortOrder
}) => {
    const totalHeaders = [...headers.globalHeaders, ...headers.platformHeaders];

    console.log('HEADEEERRR')
    console.log(sortOrder)

    const onHeaderClicked = (field) => {
        if (!sortOrder || sortOrder.field !== field) {
            console.log('hi')
            setSortOrder({
                field,
                order: 'desc',
            });

            return;
        }

        setSortOrder({
            field,
            order: (sortOrder.order === 'desc') ? 'asc' : 'desc',
        });
    }

    const sortedPosts = posts;
    if (sortOrder) {
        switch(sortOrder.field) {
            case 'datePosted':
                sortedPosts.sort((a,b) => (
                    (sortOrder.order === 'desc')
                        ? new Date(b[sortOrder.field]) - new Date(a[sortOrder.field])
                        : new Date(a[sortOrder.field]) - new Date(b[sortOrder.field])
                ));
                break;
            case 'platform':
            case 'profileName':
            case 'caption':
                sortedPosts.sort((a,b) => (
                    (sortOrder.order === 'desc')
                        ? b[sortOrder.field].localeCompare(a[sortOrder.field])
                        : a[sortOrder.field].localeCompare(b[sortOrder.field])
                ));
                break;
            default:
                sortedPosts.sort((a,b) => (
                    (sortOrder.order === 'desc')
                        ? b[sortOrder.field] - a[sortOrder.field]
                        : a[sortOrder.field] - b[sortOrder.field]
                ));
        }
    }

    const getStyle = (fieldName, isHeader) => {
        switch(fieldName) {
            case 'Platform':
                return isHeader ? styles.headerFieldShort : styles.postFieldShort;
            case 'Profile':
                return isHeader ? styles.headerFieldProfileName : styles.postFieldProfileName;
            default:
                return isHeader ? styles.headerFieldLong : styles.postFieldLong;
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {
                    totalHeaders.map(({ field, displayName }, keyIndex) => {
                        return (
                            <div className={getStyle(displayName, true)}>
                                <Card sx={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} variant="outlined"  onClick={() => {onHeaderClicked(`${field}`)}} key={keyIndex}>
                                    <CardActionArea sx={{ width: '100%', height: '100%' }}>
                                        <div className={styles.headerInner}>
                                            <div className={styles.headerName}>
                                                { (displayName !== 'Platform') && displayName }
                                            </div>
                                            <div className={styles.headerIcon}>
                                                { (sortOrder && sortOrder.field === field && sortOrder.order === 'asc') && <ExpandMore/>}
                                                { (sortOrder && sortOrder.field === field && sortOrder.order === 'desc') && <ExpandLess/>}
                                            </div>
                                        </div>
                                    
                                    </CardActionArea>
                                </Card>
                            </div>
                        );
                    })
                }
            </div>
            { 
                sortedPosts.map((post, postIndex) => {
                    return (
                        <div className={styles.post} key={postIndex} onClick={() => {openPopUp(post)}}>
                            {
                                totalHeaders.map(({ field, displayName }, keyIndex) => {
                                    const platform = profiles.find((profile => (profile.profileName === post.profileName))).platform;
                                    return (
                                        <div className={getStyle(displayName, false)} key={keyIndex}>
                                            {
                                                (() => {
                                                    switch(displayName) {
                                                        case 'Platform':
                                                            return (
                                                                <div className={styles.logo}>
                                                                    <img
                                                                        src={platformToLogoUrlMap[platform].url}
                                                                        alt='profile pic'
                                                                        style={{
                                                                            height: '100%',
                                                                            width: '100%',
                                                                            objectFit: 'contain',
                                                                        }}
                                                                        referrerPolicy="no-referrer"
                                                                    />
                                                                </div>
                                                            );
                                                        case 'Date':
                                                            return new Date(post[field]).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric" });
                                                        default:
                                                            return <div className={styles.fieldContent}>{post[field]}</div>;
                                                    }
                                                })()
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}

export default PostsContainerPostsView;