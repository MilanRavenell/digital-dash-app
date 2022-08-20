import React from 'react';
import '../styles/PostsContainerPostsView.css'

const PostsContainerPostsView = ({ posts, headers, profiles, openPopUp }) => {
    return (
        <div className="PostsContainerPostsView">
            <div className="PostsContainerPostsView-header">
                {
                    headers.map(({ displayName }, keyIndex) => {
                        const style = displayName === 'Platform' ? 'short' : 'long'
                        return (
                            <div className={`PostsContainerPostsView-header-field PostsContainerPostsView-header-field-${style}`} key={keyIndex}>
                                { displayName }
                            </div>
                        );
                    })
                }
            </div>
            { 
                posts.map((post, postIndex) => {
                    return (
                        <div className="PostsContainerPostsView-post" key={postIndex} onClick={() => {openPopUp(post)}}>
                            {
                                headers.map(({ field, displayName }, keyIndex) => {
                                    const style = displayName === 'Platform' ? 'short' : 'long'
                                    return (
                                        <div className={`PostsContainerPostsView-post-field PostsContainerPostsView-post-field-${style}`} key={keyIndex}>
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