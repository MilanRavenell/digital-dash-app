
import React from 'react';
import StatContainer from './StatContainer';
import { batchArray } from '../helpers';

import styles from '../styles/AggregatedStatsContainer.module.css';

const AggregatedStatsContainer = ({ data }) => {

    const getContent = () => {
        return batchArray(Object.keys(data), 4)
            .map((batch, batchIndex) => (
                <div className={styles.row} key={batchIndex}>
                    {
                        batch.map((stat, keyIndex) => (
                            <StatContainer name={stat} value={data[stat]} key={keyIndex}/>
                        ))
                    }
                </div>
            ));
    }

    return (
        <div className={styles.container}>
            { getContent() }
        </div>
    )
}

export default AggregatedStatsContainer;