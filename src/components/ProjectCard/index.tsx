import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type {Project} from '@site/src/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({project}: ProjectCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className={styles.stack}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.badge}>
              {tech}
            </span>
          ))}
        </div>
        <div className={styles.links}>
          <Link href={project.repoUrl} className={styles.link}>
            📦 Repositório
          </Link>
          {project.demoUrl && (
            <Link href={project.demoUrl} className={styles.link}>
              🌐 Demo
            </Link>
          )}
          {project.docsUrl && (
            <Link href={project.docsUrl} className={styles.link}>
              📚 Docs
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
