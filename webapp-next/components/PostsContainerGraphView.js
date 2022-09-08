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
            <Bar data={graphData} options={{ responsive: true, maintainAspectRatio: false }}/>
        </div>
    );
}

export default PostsContainerGraphView;