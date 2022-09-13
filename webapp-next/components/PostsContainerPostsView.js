import React from 'react';
import { platformToLogoUrlMap } from '../helpers';
import Image from 'next/image';

import styles from '../styles/PostsContainerPostsView.module.css';

const PostsContainerPostsView = ({ posts, headers, profiles, openPopUp }) => {
    const totalHeaders = [...headers.globalHeaders, ...headers.platformHeaders];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {
                    totalHeaders.map(({ displayName }, keyIndex) => {
                        const style = displayName === 'Platform' ? styles.headerFieldShort : styles.headerFieldLong
                        return (
                            <div className={style} key={keyIndex}>
                                { (displayName !== 'Platform') && displayName }
                            </div>
                        );
                    })
                }
            </div>
            { 
                posts.map((post, postIndex) => {
                    return (
                        <div className={styles.post} key={postIndex} onClick={() => {openPopUp(post)}}>
                            {
                                totalHeaders.map(({ field, displayName }, keyIndex) => {
                                    const style = displayName === 'Platform' ? styles.postFieldShort : styles.postFieldLong;
                                    const platform = profiles.find((profile => (profile.profileName === post.profileName))).platform;
                                    return (
                                        <div className={style} key={keyIndex}>
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
                                                        case 'Caption':
                                                            return (<a href={post['Link']} target="_blank" rel="noreferrer">{post[field]}</a>);
                                                        case 'Date':
                                                            return new Date(post[field]).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric" });
                                                        default:
                                                            return post[field];
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