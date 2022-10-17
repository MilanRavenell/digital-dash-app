
import React from 'react';
import StatContainer from './StatContainer';
import { batchArray } from '../helpers';

import styles from '../styles/AggregatedStatsContainer.module.css';

const AggregatedStatsContainer = ({
    data,
    isMobile,
}) => {
    const getContent = () => {
        return batchArray(data.stats, (isMobile ? 2 : 4))
            .map((batch, batchIndex) => (
                <div className={styles.row} key={batchIndex}>
                    {
                        batch.map((stat, keyIndex) => (
                            <StatContainer
                                name={(stat || {}).name}
                                value={(stat || {}).value}
                                comparisonTimeframeStart={data.previousComparisonTimeframeStart}
                                comparisonTimeframeEnd={data.previousComparisonTimeframeEnd}
                                percentDiff={(stat || {}).percentDiff}
                                key={keyIndex}
                            />
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