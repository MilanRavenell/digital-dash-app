import React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

import styles from '../styles/DatePicker.module.css';

const DatePicker = ({
    submit,
}) => {
    const [startDate, setStartDate] = React.useState((dayjs()));
    const [endDate, setEndDate] = React.useState((dayjs()));

    const handleApply = () => {
        // convert to UTC
        submit(startDate.toDate(), endDate.toDate());
    };

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.left}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            label="Week picker"
                            value={startDate}
                            views={['month', 'year', 'day']}
                            openTo="day"
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <div className={styles.right}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            label="Week picker"
                            value={endDate}
                            views={['month', 'year', 'day']}
                            openTo="day"
                            onChange={(newValue) => {
                                setEndDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className={styles.bottom}>
                <Button onClick={handleApply} variant="contained">Apply</Button>
            </div>
        </div>
    )
}

export default DatePicker;