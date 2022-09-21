import React from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Popover from '@mui/material/Popover';

import styles from '../styles/AddPlatformInstructions.module.css';

const AddPlatformInstructions = ({
    platform,
}) => {
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const twitter = (
        <div className={styles.container}>
            <div className={styles.instructionsHeader}>
                {`How to add a Twitter account`}
            </div>
            <div className={styles.body}>
                <ol>
                    <li>Navigate to <a href={'https://twitter.com'} target='_blank' rel='noreferrer'>twitter.com</a></li>
                    <li>Ensure you are logged into the profile you want to add, and it is currently the active account</li>
                    <li>On this page, click "Sign in with Twitter"</li>
                    <li>Approve access</li>
                    <li>Confirm</li>
                </ol>
            </div>
        </div>
    );

    const youtube = (
        <div className={styles.container}>
            <div className={styles.instructionsHeader}>
                {`How to add a Youtube account`}
            </div>
            <div className={styles.body}>
                <ol>
                    <li>On this page, click "Sign in with Youtube"</li>
                    <li>Choose the gmail associated with the Youtube account you want to add</li>
                    <li>Approve access</li>
                    <li>Confirm</li>
                </ol>
            </div>
        </div>
    );

    const instagram = (
        <div className={styles.container}>
            <div className={styles.instructionsHeader}>
                {`How to add an Instagram Basic account`}
            </div>
            <div className={styles.body}>
                <ol>
                    <li>Navigate to <a href={'https://www.instagram.com/'} target='_blank' rel='noreferrer'>instagram.com</a></li>
                    <li>Ensure you are logged into the profile you want to add, and it is currently the active account</li>
                    <li>On this page, click "Sign in with Instagram Basic"</li>
                    <li>Approve access</li>
                    <li>Confirm</li>
                </ol>
            </div>
            <div className={styles.instructionsHeader}>
                {`How to add an Instagram Professional account`}
                <InfoOutlined
                    sx={{ color: 'blue' }}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                />
            </div>
            <div className={styles.body}>
                <ol>
                    <li>Have an Instagram Professional Account
                        <ul>
                            <li>Follow the steps <a href={'https://help.instagram.com/502981923235522'} target='_blank' rel='noreferrer'>here</a> if you would like to upgrade your account</li>
                        </ul>
                    </li>
                    <li>Have a Facebook Page associated with that Instagram account
                        <ul>
                            <li>Follow the steps <a href={'https://www.facebook.com/business/help/345675946300334?id=419087378825961'} target='_blank' rel='noreferrer'>here</a> to link a page with your Instagram account</li>
                        </ul>
                    </li>
                    <li>Navigate to <a href={'https://https://www.facebook.com/'} target='_blank' rel='noreferrer'>facebook.com</a></li>
                    <li>Ensure you are logged into the facebook account associated with your Facebook Page and Instagram account</li>
                    <li>On this page, click "Sign in with Instagram Pro"</li>
                    <li>Approve access for all accounts you would like to add</li>
                    <li>Confirm</li>
                </ol>
            </div>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={popoverAnchorEl !== null}
                anchorEl={popoverAnchorEl}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <div className={styles.popover}>
                    <div className={styles.popoverContent}>
                        With an Instagram Professional Account, you get access to the number of users who have viewed and save a given post, and how many individual accounts have reached a given post (Only applies to posts made after the account was upgraded to professional). Upgrading your account is free and encouraged for anyone serious about growing their brand!
                    </div>
                </div>
                
            </Popover>
        </div>
    );

    const tiktok = (
        <div className={styles.container}>
            <div className={styles.instructionsHeader}>
                {`How to add a Tiktok account`}
            </div>
            <div className={styles.body}>
                <ol>
                    <li>On the Tiktok profile you want to add, update the bio to include "digitaldashappXD"
                        <ul>
                            <li>This is just a security measure to ensure you own the account. You can remove as soon as the account is added</li>
                        </ul>
                    </li>
                    <li>Enter the handle of the account you want to add</li>
                    <li>Click "Register Tiktok Account"</li>
                    <li>Confirm</li>
                </ol>
            </div>
        </div>
    );

    const platformMap = Object.freeze({
        twitter,
        youtube,
        instagram,
        tiktok,
    })

    return platformMap[platform];
};

export default AddPlatformInstructions