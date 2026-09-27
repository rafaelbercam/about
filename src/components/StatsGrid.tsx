import React from 'react';
import styles from './StatsGrid.module.css';

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.label}>{stat.label}</div>
          {stat.description && <div className={styles.description}>{stat.description}</div>}
        </div>
      ))}
    </div>
  );
}
