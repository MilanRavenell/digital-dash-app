
import React from 'react';
import StatContainer from './StatContainer';
import bacthArray from './batch-array';
import './styles/AggregatedStatsContainer.css';

const AggregatedStatsContainer = ({ data }) => {

    const getContent = () => {
        return bacthArray(Object.keys(data), 4)
            .map((batch, batchIndex) => (
                <div className='AggregatedStatsContainer-row' key={batchIndex}>
                    {
                        batch.map((stat, keyIndex) => (
                            <StatContainer name={stat} value={data[stat]} key={keyIndex}/>
                        ))
                    }
                </div>
            ));
    }

    return (
        <div className='AggregatedStatsContainer'>
            { getContent() }
        </div>
    )
}

export default AggregatedStatsContainer;