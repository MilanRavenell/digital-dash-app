import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import { platformToLogoUrlMap } from '../helpers';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import WarningOutlined from '@mui/icons-material/WarningOutlined';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../styles/ProfileCard.module.css';

const ProfileCard = ({
    profile,
    handleClick,
    handleDelete,
    handleNeedsRefresh,
    isAddProfileConfirmation = false,
}) => {
    const profilePicUrl = (profile.profilePicUrl !== null && profile.profilePicUrl !== undefined) ? profile.profilePicUrl : '/';

    const [iconIsHovered, setIconIsHovered] = React.useState(false);

    const renderIcons = () => {
        const icons = [];

        if (!profile.postsLastPopulated && !isAddProfileConfirmation) {
            icons.push(
                <div
                    className={styles.loading}
                    key={'loading'}
                >
                    <CircularProgress size={'max(3vmin, 20px)'}/>
                </div>
            )
        }

        if (profile.needsRefresh) {
            icons.push(
                <div 
                    onMouseOver={() => {setIconIsHovered(true)}}
                    onMouseOut={() => {setIconIsHovered(false)}}
                    className={styles.warning}
                    key={'refresh-warning'}
                >
                    <IconButton onClick={() => {handleNeedsRefresh(profile)}}>
                        <WarningOutlined/>
                    </IconButton>
                </div>
            )
        }

        if (handleDelete) {
            icons.push(
                <div
                    onMouseOver={() => {setIconIsHovered(true)}}
                    onMouseOut={() => {setIconIsHovered(false)}}
                    className={styles.delete}
                    key={'delete'}
                >
                    <IconButton onClick={handleDelete}>
                        <DeleteOutlined/>
                    </IconButton>
                </div>
            );
        }

        return icons;
    }

    return (
        <Card sx={{ width: '100%', height: '100%' }} onClick={iconIsHovered ? null : handleClick}>
            <CardActionArea sx={{ width: '100%', height: '100%' }}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <img
                            src={profilePicUrl}
                            alt="profile pic"
                            loading='lazy'
                            referrerPolicy="no-referrer"
                            className={styles.profPic}
                        />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.icons}>
                            { renderIcons() }
                            <div className={styles.logoContainer}>
                                <img
                                    src={platformToLogoUrlMap[profile.platform].url}
                                    alt="profile pic"
                                    loading='lazy'
                                    referrerPolicy="no-referrer"
                                    className={styles.logo}
                                />
                            </div>
                        </div>
                        <div className={styles.rightBottom}>
                            <div className={styles.profileName}>
                                {profile.profileName}
                            </div>
                        </div>
                    </div>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default ProfileCard;