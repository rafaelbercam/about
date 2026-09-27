import React from 'react';
import styles from './FeatureGrid.module.css';

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export default function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  return (
    <div className={styles.grid} style={{ '--columns': columns } as React.CSSProperties}>
      {features.map((feature, index) => (
        <div key={index} className={styles.card}>
          {feature.icon && <div className={styles.icon}>{feature.icon}</div>}
          <h4 className={styles.title}>{feature.title}</h4>
          <p className={styles.description}>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
