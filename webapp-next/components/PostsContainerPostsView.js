import React from 'react';
import { platformToLogoUrlMap } from '../helpers';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { ExpandLess, ExpandMore, LteMobiledataOutlined } from '@mui/icons-material';
import moment from 'moment';

import styles from '../styles/PostsContainerPostsView.module.css';

const PostsContainerPostsView = ({
    posts,
    headers,
    profiles,
    openPopUp,
    sortOrder,
    setSortOrder,
    isMobile,
}) => {
    const totalHeaders = headers.globalHeaders;

    // Remove caption on mobile
    if (isMobile) {
        ['Caption'].forEach(header => {
            const headerIndex = totalHeaders.findIndex(totalHeader => (totalHeader.displayName === header));
            if (headerIndex > -1) {
                totalHeaders.splice(headerIndex, 1);
            }
        })
    } else {
        totalHeaders.push(...headers.platformHeaders)
    }
    
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
        let base = isHeader ? `${styles.headerField} ` : '';
        let type = isHeader ? styles.headerFieldLong : styles.postFieldLong;

        switch(fieldName) {
            case 'Platform':
            case 'Profile':
                type = isHeader ? styles.headerFieldShort : styles.postFieldShort;
                break;
            case 'Total Engagement':
            case 'Engagement Rate':
                if (isHeader) {
                    base = `${styles.headerFieldSmallFont} `;
                }
                break;
        }

        return `${base} ${type}`
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
                                                { (displayName !== 'Platform' && displayName !== 'Profile') && displayName }
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
                        <Card sx={{ borderRadius: 0, border: 'none' }} variant="outlined" onClick={() => {openPopUp(post)}} key={postIndex}>
                            <CardActionArea>
                                <div className={styles.post}>
                                    {
                                        totalHeaders.map(({ field, displayName }, keyIndex) => {
                                            const profile = profiles.find((profile => (profile.profileName === post.profileName)));
                                            const platform = profile.platform;
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
                                                                                alt='platform logo'
                                                                                style={{
                                                                                    height: '100%',
                                                                                    width: '100%',
                                                                                    objectFit: 'contain',
                                                                                }}
                                                                                referrerPolicy="no-referrer"
                                                                            />
                                                                        </div>
                                                                    );
                                                                case 'Profile':
                                                                    return (
                                                                        <div className={styles.profPic}>
                                                                            <img
                                                                                src={profile.profilePicUrl}
                                                                                alt={'profile pic'}
                                                                                style={{
                                                                                    height: '100%',
                                                                                    width: '100%',
                                                                                    objectFit: 'contain',
                                                                                }}
                                                                                referrerPolicy="no-referrer"
                                                                            />
                                                                        </div>
                                                                    )
                                                                case 'Date':
                                                                    return <div className={styles.fieldContent}>{moment.utc(post[field]).format(isMobile ? 'M/DD/YYYY' : 'MMM D, YYYY HH:mm')}</div>;
                                                                case 'Engagement Rate':
                                                                    return <div className={styles.fieldContent}>{post[field] ? `${(post[field] * 100).toFixed(2)}%` : '--'}</div>;
                                                                default:
                                                                    return <div className={displayName === 'Caption' ? styles.fieldContentText : styles.fieldContent}>{(post[field] || '--').toLocaleString()}</div>;
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