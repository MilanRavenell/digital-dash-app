import React from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Popover from '@mui/material/Popover';

import styles from '../styles/StatContainer.module.css';

const StatContainer = ({
    name,
    value,
    percentDiff,
}) => {
    const popoverAnchorEl = React.useRef();
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    }

    const getPercentDiffColor = () => {
        if (percentDiff < 0) {
            return 'red'
        }

        if (percentDiff > 0) {
            return 'green'
        }

        return 'gray'
    }

    const getIcon = () => {
        if (percentDiff < 0) {
            return <ArrowDropDownIcon/>
        }

        if (percentDiff > 0) {
            return <ArrowDropUpIcon/>
        }
    }

    return(
        <div className={styles.container}>
            {
                (name != null) && (
                    <div className={styles.inner}>
                        <div className={styles.content}>
                            <div className={styles.title}> { name } </div>
                            <div className={styles.values}> 
                                <div className={styles.value}>
                                    { value }
                                </div>
                                {
                                    (percentDiff !== null && percentDiff !== undefined) &&
                                    <div
                                        className={styles.diff}
                                        style={{ color: getPercentDiffColor() }}
                                        ref={popoverAnchorEl}
                                        onMouseOver={() => {setPopoverOpen(true)}}
                                        onMouseOut={handlePopoverClose}
                                    >
                                        { getIcon() }
                                        {`${Math.abs(percentDiff * 100).toFixed(2)}%`}
                                    </div>
                                }
                                
                            </div>
                            <div className={styles.footer}/>
                        </div>
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
                            In comparison to yung money
                        </Popover>
                    </div>
                )
            }
        </div>
    )
}

export default StatContainer;