import React from 'react';

import styles from '../styles/PostsContainerPostsView.module.css';

const PostsContainerPostsView = ({ posts, headers, profiles, openPopUp }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {
                    headers.map(({ displayName }, keyIndex) => {
                        const style = displayName === 'Platform' ? styles.headerFieldShort : styles.headerFieldLong
                        return (
                            <div className={style} key={keyIndex}>
                                { displayName }
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
                                headers.map(({ field, displayName }, keyIndex) => {
                                    const style = displayName === 'Platform' ? styles.postFieldShort : styles.postFieldLong;
                                    return (
                                        <div className={style} key={keyIndex}>
                                            {
                                                (() => {
                                                    switch(displayName) {
                                                    case 'Platform':
                                                        return profiles.find((profile => (profile.profileName === post.profileName))).platform;
                                                    case 'Caption':
                                                        return (<a href={post['Link']} target="_blank" rel="noreferrer">{post[field]}</a>);
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