import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import styles from '../styles/Loading.module.css';

const Loading = ({}) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.text}>Loading</div>
                <div className={styles.progress}><LinearProgress/></div>  
            </div>
        </div>
    )
}

export default Loading;