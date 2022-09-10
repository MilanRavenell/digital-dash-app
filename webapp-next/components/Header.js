import React from 'react';
import { MenuItem, Menu, IconButton } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';

import styles from '../styles/Header.module.css';

const Header = ({ user, goToAddPlatformSelection, signOut }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openSettingsMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeSettingsMenu = () => {
        setAnchorEl(null);
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.leftBanner}>
                    Digital Dash App
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightContent}>
                    <div className={styles.rightContentName}>
                        Hi, {user.firstName}
                    </div>
                    <div className={styles.headerRightContentSettings}>
                        <IconButton onClick={openSettingsMenu}>
                            <SettingsOutlined fontSize="medium"/>
                        </IconButton>
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={anchorEl !== null}
                        onClose={closeSettingsMenu}>
                        {goToAddPlatformSelection && <MenuItem onClick={goToAddPlatformSelection}>Add/Remove Accounts</MenuItem>}
                        <MenuItem onClick={signOut}>Sign Out</MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Header;