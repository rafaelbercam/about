import React from 'react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  videoUrl?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  videoUrl,
  featured = false,
}: ProjectCardProps) {
  return (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {featured && <span className={styles.badge}>Em Destaque</span>}
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.technologies}>
        {technologies.map((tech) => (
          <span key={tech} className={styles.tech}>
            {tech}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Ver no GitHub
        </a>
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Ver Vídeo
          </a>
        )}
      </div>
    </div>
  );
}
