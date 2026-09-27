import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ProjectCard from '@site/src/components/ProjectCard';
import {projects} from '@site/src/data/projects';
import styles from './projetos.module.css';

export default function ProjetosPage(): JSX.Element {
  return (
    <Layout title="Projetos" description="Meus projetos pessoais e contribuições">
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Meus Projetos</h1>
          <p>Uma seleção de projetos pessoais que demonstram minha experiência e paixão por desenvolvimento.</p>
        </div>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
