import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { platformToLogoUrlMap } from '../helpers';

const ProfileCard = ({ profile }) => {
    const profilePicUrl = (profile.profilePicUrl !== null && profile.profilePicUrl !== undefined) ? profile.profilePicUrl : '/';

    return (
        <Card sx={{ width: '100%', height: '100%' }}>
            <CardActionArea sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ display: 'flex', height: '100%' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: '25%' }}
                        image={profilePicUrl}
                        alt="profile pic"
                    />
                    <Box sx={{ width: '75%', textAlign: 'right', padding: 0, paddingRight: '2%', height: '100%' }} >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            height: '50%'
                        }}>
                            <CardMedia
                                component="img"
                                sx={{ width: '12%', objectFit: 'contain' }}
                                image={platformToLogoUrlMap[profile.platform].url}
                                alt="profile pic"
                            />
                        </Box>
                        <Typography variant='h6' sx={{ height: '50%' }}>
                            {profile.profileName}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export default ProfileCard;