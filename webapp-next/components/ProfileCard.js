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
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    key={'loading'}
                >
                    <CircularProgress/>
                </div>
            )
        }

        if (profile.needsRefresh) {
            icons.push(
                <div 
                    onMouseOver={() => {setIconIsHovered(true)}}
                    onMouseOut={() => {setIconIsHovered(false)}}
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
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
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
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
                <Box sx={{ display: 'flex', height: '100%' }}>
                    <CardMedia
                        component="img"
                        sx={{
                            flex: 1,
                            maxWidth: '90px',
                        }}
                        image={profilePicUrl}
                        alt="profile pic"
                    />
                    <Box sx={{
                        flex: 1,
                        textAlign: 'right',
                        padding: 0,
                        marginRight: '5px',
                        height: '100%',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            height: '50%',
                            position: 'absolute',
                            width: '100%',
                            zIndex: '2'
                        }}>
                            { renderIcons() }
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <img
                                    src={platformToLogoUrlMap[profile.platform].url}
                                    alt="profile pic"
                                    loading='lazy'
                                    referrerPolicy="no-referrer"
                                    style={{
                                        height: '80%',
                                        objectFit: 'contain',
                                        maxHeight: '60px',
                                    }}
                                />
                            </div>
                        </Box>
                        <Typography variant='h6' sx={{
                            height: '50%',
                            position: 'absolute',
                            top: '50%',
                            width: '100%',
                        }}>
                            {profile.profileName}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export default ProfileCard;