
import React from 'react';
import StatContainer from './StatContainer';
import TimeFramePicker from './TimeframePicker';

const AveragesContainer = ({ data }) => {
    const [state, setState] = React.useState({
        timeframe: 'day',
    });

    const handleTimeframeChange = React.useCallback((newValue) => {
        setState({
            timeframe: newValue
        });
    }, []);

    
    return (
        <div style={{ display: 'flex', border: '1px solid black', borderRadius: '5px'}}>
            <StatContainer name='Average Views' value={data[state.timeframe].avg_views}/>
            <StatContainer name='Average Engagement' value={data[state.timeframe].avg_engagements}/>
            <TimeFramePicker timeframe={state.timeframe} onChange={handleTimeframeChange}/>
        </div>
    )
}

export default AveragesContainer;