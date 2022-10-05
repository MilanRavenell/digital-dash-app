import React from 'react';
import { platformToLogoUrlMap } from '../helpers';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import moment from 'moment';

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
                            <div className={getStyle(displayName, true)} key={keyIndex}>
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
                        <Card sx={{ borderRadius: 0, border: 'none' }} variant="outlined" onClick={() => {openPopUp(post)}}>
                            <CardActionArea>
                                <div className={styles.post} key={postIndex}>
                                    {
                                        totalHeaders.map(({ field, displayName }, keyIndex) => {
                                            const platform = profiles.find((profile => (profile.profileName === post.profileName))).platform;
                                            const timezoneOffset = new Date().getTimezoneOffset();
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
                                                                    const date = moment(post[field]);
                                                                    date.subtract(timezoneOffset, 'minutes');
                                                                    return <div className={styles.fieldContent}>{date.format('MMM D, YYYY')}</div>;
                                                                case 'Engagement Rate':
                                                                    return <div className={styles.fieldContent}>{post[field] ? `${(post[field] * 100).toFixed(2)}%` : '--'}</div>;
                                                                default:
                                                                    return <div className={styles.fieldContent}>{(post[field] || '--').toLocaleString()}</div>;
                                                            }
                                                        })()
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </CardActionArea>
                        </Card>
                    )
                })
            }
        </div>
    );
}

export default PostsContainerPostsView;