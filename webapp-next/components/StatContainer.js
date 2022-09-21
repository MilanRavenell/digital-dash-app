import React from 'react';

import styles from '../styles/StatContainer.module.css';

class StatContainer extends React.Component {
    render() {
        return(
            <div className={styles.container}>
                {
                    (this.props.name != null) && (
                        <div className={styles.inner}>
                            <div className={styles.content}>
                                <div className={styles.title}> { this.props.name } </div>
                                <div className={styles.value}> { this.props.value.toLocaleString() } </div>
                                <div className={styles.footer}/>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default StatContainer;