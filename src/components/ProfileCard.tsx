import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  imageUrl: string;
  alt?: string;
}

export default function ProfileCard({ imageUrl, alt = 'Foto de Perfil' }: ProfileCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={imageUrl} alt={alt} className={styles.image} />
      </div>
    </div>
  );
}
