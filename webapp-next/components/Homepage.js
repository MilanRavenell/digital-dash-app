import React from 'react';
import Footer from './Footer';

import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.sectionSmall}>
                    <div className={styles.contentInner}>
                        <div className={styles.logoContainer}>
                            <img 
                                className={styles.logo}
                                src='/orb_logo.png'
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionContent}>
                        <div className={styles.contentInner}>
                            <div className={`${styles.imageContainer} ${styles.grow}`}>
                                <img 
                                    className={styles.image}
                                    src='/orb_home_page_photo1.png'
                                />
                            </div>
                        </div>
                        <div className={styles.contentInner}>
                            <div className={styles.text}>
                                <div className={styles.header}>
                                    Advanced social media analytics - for free!
                                </div>
                                <div className={styles.description}>
                                    Orb is a real-time social media analytic and reporting tool for individual content creators looking to grow their brand from scratch. Enjoy free access to advanced social media tools that business are paying hundreds to thousands of dollars a year to utilize.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionContent}>
                        <div className={styles.contentInner}>
                            <div className={styles.text}>
                                <div className={styles.header}>
                                    Track key metrics over time
                                </div>
                                <div className={styles.description}>
                                    Grow your brand fast with advanced analytics, having access to real-time key social media metrics recorded and processed in real time, visualized in a dashboard giving you a birds-eye-view of how your brand is evolving over time. Use data to recognize patterns impossible to see otherwise.
                                </div>
                            </div>
                        </div>
                        <div className={styles.contentInner}>
                            <div className={`${styles.imageContainer} ${styles.grow}`}>
                                <img 
                                    className={styles.image}
                                    src='/orb_home_page_photo2.png'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionContent}>
                        <div className={styles.contentInner}>
                            <div className={`${styles.imageContainer} ${styles.grow}`}>
                                <img 
                                    className={styles.image}
                                    src='/orb_home_page_photo3.png'
                                />
                            </div>
                        </div>
                        <div className={styles.contentInner}>
                            <div className={styles.text}>
                                <div className={styles.header}>
                                    Cross-platform reporting made easy
                                </div>
                                <div className={styles.description}>
                                    With all of your metrics gathered in one place, reporting your total reach across all major platforms to potential sponsors is quick and easy.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default Homepage;