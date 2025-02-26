import React from 'react';
import styles from '../styles/Loading.module.css'; // Import the CSS module

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
      <div className={`relative ${styles.spinner}`}>
        <div className={`${styles.spinnerSegment} ${styles.segment1}`}></div>
        <div className={`${styles.spinnerSegment} ${styles.segment2}`}></div>
        <div className={`${styles.spinnerSegment} ${styles.segment3}`}></div>
        <div className={`${styles.spinnerSegment} ${styles.segment4}`}></div>
      </div>
    </div>
  );
};

export default Loading;
