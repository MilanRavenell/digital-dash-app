import Button from '@mui/material/Button';
import FollowUs from './FollowUs';

import styles from '../styles/Footer.module.css';

const Footer = ({
    openPrivacyPolicy,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <FollowUs/>
                <Button 
                    onClick={openPrivacyPolicy}
                    sx={{
                        color: 'gray'
                    }}
                >
                    Privacy Policy
                </Button>
            </div>
        </div>
    );
}

export default Footer;