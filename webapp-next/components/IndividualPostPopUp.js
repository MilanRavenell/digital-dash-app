import React from 'react';
import Image from 'next/image';
import { platformToLogoUrlMap } from '../helpers';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import styles from '../styles/IndividualPostPopUp.module.css'

const Stat = ({ name, value, smallFont }) => {
    const style = smallFont ? { fontSize: 'small'} : { fontSize: 'large' };
    return (
        <div className={styles.stat}>
            <div className={styles.statName} style={style}>
                { name }
            </div>
            <div className={styles.statValue} style={style}>
                { value }
            </div>
        </div>
    )
}

const Media = ({ mediaList }) => {
    return (
        <div className={styles.media}>
            <ImageList cols={4} sx={{
                margin: '10px',
            }}>
            {
                mediaList.map((media, index) => (
                    <ImageListItem key={index} sx={{
                        borderRadius: '10px',
                    }}>
                        <img
                            src={media.thumbnailUrl}
                            alt={'media'}
                            loading='lazy'
                            referrerPolicy="no-referrer"
                            style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </ImageListItem>
                ))
            }
            </ImageList>
        </div>
    )
}

const IndividualPostPopUp = ({ post, headers }) => {
    const platform = post.__typename.split('Post')[0].toLowerCase();

    return (
        <div className={styles.container}>
            <div className={styles.details}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img
                            src={platformToLogoUrlMap[platform].url}
                            alt={'media'}
                            loading='lazy'
                            referrerPolicy="no-referrer"
                            style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </div>
                <div className={styles.title}>
                    {
                        (post.media.length > 0) && (
                            <Media mediaList={post.media}/>
                        )
                    }
                    <div className={styles.titleCaption}>
                        {
                            (post.caption !== '') &&
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    id="outlined-disabled"
                                    label="Caption"
                                    defaultValue={post.caption}
                                    fullWidth
                                    multiline
                                />
                        }
                    </div>
                </div>
                <div className={styles.extraDetails}>
                    <div className={styles.titleDate}>{post.profileName}</div>
                    <div className={styles.titleDate}>{new Date(post.datePosted).toLocaleDateString('en-us', { year:'numeric', month:'short', day:'numeric' })}</div>
                    <div className={styles.titleLink}>
                        <a href={post.link} target='_blank' rel='noreferrer'>Link</a>
                    </div>
                </div>
            </div>
            <div className={styles.stats}>
                <Stat name='Views' value={((post.viewCount !== null) ? post.viewCount : '--').toLocaleString()}/>
                <Stat name='Total Engagement' value={(post.engagementCount || 0).toLocaleString()}/>
                <Stat name='Engagement Rate' value={(post.engagementRate !== null) ? `${(post.engagementRate * 100).toFixed(2)}%` : '--'}/>
                <div className={styles.separator}/>
                {
                    headers.map((header, index) => (
                        <Stat name={header.displayName} value={((post[header.field] !== null && post[header.field] !== undefined) ? post[header.field] : '--').toLocaleString()} smallFont={true} key={index}/>
                    ))
                }
            </div>
            <div className={styles.engagements}>

            </div>
        </div>
    );
}

export default IndividualPostPopUp;