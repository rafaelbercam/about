import React from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className={styles.videoContainer}>
      <video
        controls
        className={styles.video}
        title={title}
      >
        <source src={src} type="video/quicktime" />
        <source src={src} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
      {title && <p className={styles.title}>{title}</p>}
    </div>
  );
}
