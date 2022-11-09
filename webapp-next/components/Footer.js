import Button from '@mui/material/Button';

import styles from '../styles/Footer.module.css';

const Footer = ({
    openPrivacyPolicy,
}) => {
    const accounts = [
        {
            logo: '/twitter_logo_outline.png',
            link: 'https://twitter.com/orb_analytics',
        }, 
        {
            logo: '/instagram_logo_outline.png',
            link: 'https://www.instagram.com/orbrealtimeanalytics/',
        }, 
        {
            logo: 'tiktok_logo_outline.png',
            link: 'https://www.tiktok.com/@orbrealtimeanalytics',
        }, 
        {
            logo: 'youtube_logo_outline.png',
            link: 'https://www.youtube.com/channel/UCPIwhp_V_sOPiKT-wi-Ql5g',
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.followUs}>
                    <div className={styles.text}>
                        Follow us on: 
                    </div>
                    <div className={styles.logos}>
                        {
                            accounts.map(account => (
                                <div className={styles.logoContainer}>
                                    <a
                                        href={account.link}
                                        target='_blank'
                                    >
                                        <img
                                            className={styles.logo}
                                            src={account.logo}
                                        />
                                    </a>
                                </div>
                            ))
                        }
                    </div>
                </div>
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