import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Popover from '@mui/material/Popover';
import DatePicker from './DatePicker';
import moment from 'moment';

import styles from '../styles/TimeframePicker.module.css';

const TimeframePicker = ({
    timeframes,
    timeframe,
    setTimeframe,
}) => {
    const popoverAnchorEl = React.useRef();
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const timeframeNames = timeframes.map(timeframe => timeframe.name);

    const handleTimeFrameChange = React.useCallback((event) => {
        const value = event.target.value;

        if (value === 'Custom') {
            setPopoverOpen(true);
            return;
        }

        const timeframeIndex = timeframeNames.indexOf(event.target.value);
        setTimeframe(timeframes[timeframeIndex]);
    }, []);

    const handleCustomTimeframe = React.useCallback((startDate, endDate) => {
        setPopoverOpen(false);
        setTimeframe({
            name: 'Custom',
            startDate,
            endDate,
        });
    }, []);

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    }

    const timezoneOffset = new Date().getTimezoneOffset();

    const start = moment(timeframe.startDate);
    start.subtract(timezoneOffset, 'minutes');
    const end = moment(timeframe.endDate);
    end.subtract(timezoneOffset, 'minutes');

    return (
        <div className={styles.container}>
            <div className={styles.dateLabel}>
                {
                    (timeframe.startDate && timeframe.endDate)
                    && `${start.format('MMM D, YYYY') } - ${end.format('MMM D, YYYY')}`
                }
            </div>
            <FormControl sx={{ m: 1, minWidth: 120, height: '100%' }} ref={popoverAnchorEl}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                    label="Timeframe"
                    value={timeframe.name}
                    onChange={handleTimeFrameChange}
                >
                {
                    timeframes.map((timeframe, index) => (
                        <MenuItem value={timeframe.name} key={index}>{timeframe.name}</MenuItem>
                    ))
                }
                </Select>
            </FormControl>
            <Popover
                open={popoverOpen}
                anchorEl={popoverAnchorEl.current}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <DatePicker submit={handleCustomTimeframe}/>
            </Popover>
        </div>
    );
}

export default TimeframePicker;