import React from 'react';
import { batchArray } from '../helpers';

import styles from '../styles/IndividualPostPopUp.module.css'

const IndividualPostPopUp = ({ post, headers }) => {
    return (
        <div className={styles.container}>
            <div className={styles.details}>
                <div className={styles.header}>
                    Post
                </div>
                <div className={styles.title}>
                    {post.caption}
                </div>
                <div className={styles.extraDetails}>
                    <div className={styles.titleDate}>{post.datePosted}</div>
                    <div className={styles.titleLink}>
                        <a href={post['Link']} target="_blank" rel="noreferrer">Link</a>
                    </div>
                </div>
            </div>
            <div className={styles.stats}>
                {
                    batchArray(headers.filter(({ displayName }) => (displayName != 'Caption' && displayName != 'Date')), 2).map((batch, batchIndex) => (
                        <div className={styles.statsRow} key={batchIndex}>
                        {
                            batch.map((header, keyIndex) => (
                                <div className={styles.statsStat} key={`${keyIndex}-stat`}>
                                    {
                                        header && (
                                            <div className={styles.statsStatContent}>
                                                <div>{header.displayName}:</div>
                                                <div>{post[header.field]}</div>
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                        </div>
                    ))
                }
            </div>
            <div className={styles.engagements}>

            </div>
        </div>
    );
}

export default IndividualPostPopUp;