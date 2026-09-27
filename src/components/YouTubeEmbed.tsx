import React from 'react';
import styles from './YouTubeEmbed.module.css';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  startSeconds?: number;
}

export default function YouTubeEmbed({ videoId, title, startSeconds = 0 }: YouTubeEmbedProps) {
  const url = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}`;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={url}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
