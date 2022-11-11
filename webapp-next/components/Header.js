import React from 'react';
import { MenuItem, Menu, IconButton, Button } from '@mui/material';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

import styles from '../styles/Header.module.css';

const Header = ({
    user,
    isHomepage,
    goToAddPlatformSelection,
    onLoginButtonPressed,
    onLogoClick,
    signOut,
    deleteAccount,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openSettingsMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeSettingsMenu = () => {
        setAnchorEl(null);
    }

    return (
        <div 
            className={styles.container}
            style={ isHomepage 
                ? {
                    height: '20vh',
                    maxHeight: '80px',
                }
                : {}
            }
        >
            <div className={styles.left}>
                <div className={styles.leftBanner}>
                    <img
                        src={'/orb_logo.png'}
                        alt={'media'}
                        loading='lazy'
                        referrerPolicy="no-referrer"
                        className={styles.logo}
                        onClick={onLogoClick}
                    />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightContent}>
                    {
                        (() => {
                            if (isHomepage) {
                                return (
                                    <div className={styles.loginButton}>
                                        <Button
                                            onClick={onLoginButtonPressed}
                                            variant='contained'
                                        >
                                            { user ? 'Back to Dashboard' : 'Get Started'}
                                        </Button>
                                    </div>
                                )
                            }

                            if (user) {
                                return [
                                    <div className={styles.rightContentName} key={'greeting'}>
                                        Hi, {user.firstName}
                                    </div>,
                                    <div className={styles.headerRightContentSettings} key={'button'}>
                                        <IconButton onClick={openSettingsMenu}>
                                            <SettingsOutlined fontSize="medium"/>
                                        </IconButton>
                                    </div>,
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={anchorEl !== null}
                                        onClose={closeSettingsMenu}
                                        key={'menu'}>
                                        {goToAddPlatformSelection && <MenuItem onClick={goToAddPlatformSelection}>Add/Remove Profiles</MenuItem>}
                                        <MenuItem onClick={signOut}>Sign Out</MenuItem>
                                        <MenuItem onClick={deleteAccount}>Delete Account</MenuItem>
                                    </Menu>
                                ];
                            } else {
                                
                            }
                        })()
                    }
                </div>
            </div>
        </div>
    )
}

export default Header;