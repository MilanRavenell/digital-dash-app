import React from 'react';

const TimeFramePicker = ({ timeframe, onChange }) => {
    const onClick = (value) => {
        onChange(value)
    }

    const style = (value) => {
        return (value === timeframe)
        ? {
            color: 'red'
        } : {
            color: 'black'
        }
    }

    return (
        <div style={{ border:"1px solid black", borderRadius: '5px', margin: '10px', flex: 1 }}>
            <div onClick={() => onClick('day')} style={style('day')}> 1 Day </div>
            <div onClick={() => onClick('week')} style={style('week')}> 1 Week </div>
            <div onClick={() => onClick('month')} style={style('month')}> 1 Month </div>
            <div onClick={() => onClick('year')} style={style('year')}> 1 Year </div>
        </div>
    );
}

export default TimeFramePicker;