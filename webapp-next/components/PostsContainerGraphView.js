import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend, } from 'chart.js';

import styles from '../styles/PostsContainerGraphView.module.css'

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

const PostsContainerGraphView = ({ graphData }) => {
    return (
        <div className={styles.container}>
            {
                graphData.map(({ name, type, graph }, index) => (
                    <div className={styles.graphContainer} key={index}>
                        <div className={styles.graphName}>
                            { name }
                        </div>
                        <div className={styles.graph}>
                            {
                                (() => {
                                    switch(type) {
                                        case 'bar':
                                            return <Bar data={graph} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0 } } }}/>;
                                        case 'line':
                                        default:
                                            return <Line data={graph} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0 } } }}/>;
                                    }
                                })()
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default PostsContainerGraphView;