import React from 'react';
import Header from './Header';

import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    return (
        <div className={styles.container}>
            <Header
                user={{firstName: 'Milan'}}
            />
            <div className={styles.section}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        Advanced social media analytics for the people.
                    </div>
                    <div className={styles.description}>
                        Orb is a real-time social media analytic and reporting tool for individual content creators looking to grow their brand from scratch. Enjoy free access to advanced social media tools that business are paying hundreds to thousands of dollars a year to utilize.
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        Track key metrics over time
                    </div>
                    <div className={styles.description}>
                        Grow your brand fast with advanced analytics, having access to real-time key social media metrics recorded and processed in real time, visualized in a dashboard giving you a birds-eye-view of how your brand is evolving over time. Use data to recognize patterns impossible to see otherwise.
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        Cross-platform reporting made easy
                    </div>
                    <div className={styles.description}>
                        With all of your metrics gathered in one place, reporting your total reach across all major platforms to potential sponsors is quick and easy.
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Homepage;