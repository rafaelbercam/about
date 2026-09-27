import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  imageUrl: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ProfileCard({
  imageUrl,
  alt = 'Foto de Perfil',
  width = 600,
  height = 315
}: ProfileCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ aspectRatio: `${width}/${height}` }}>
        <img src={imageUrl} alt={alt} className={styles.image} />
      </div>
    </div>
  );
}
