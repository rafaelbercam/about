import Layout from '@theme/Layout';
import styles from './sobre.module.css';

export default function SobrePage(): JSX.Element {
  return (
    <Layout title="Sobre" description="Sobre Rafael Bercam">
      <main className={styles.container}>
        <article className={styles.content}>
          <h1>Sobre Mim</h1>

          <section className={styles.section}>
            <h2>Quem Sou</h2>
            <p>
              Olá! Meu nome é Rafael Bercam. Sou um desenvolvedor de software apaixonado por criar
              soluções elegantes e robustas para problemas complexos.
            </p>
            <p>
              Com experiência em desenvolvimento full-stack, tenho atuado em projetos que variam desde
              aplicações web modernas até sistemas backend escaláveis. Minha abordagem combina boas
              práticas de engenharia de software, atenção aos detalhes e foco na experiência do usuário.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Experiência & Habilidades</h2>
            <p>
              Tenho experiência com diversas tecnologias e linguagens de programação:
            </p>
            <ul>
              <li><strong>Frontend:</strong> React, TypeScript, Next.js, CSS/SCSS, HTML5</li>
              <li><strong>Backend:</strong> Node.js, Python, Go, PostgreSQL, MongoDB</li>
              <li><strong>DevOps/Infra:</strong> Docker, Kubernetes, GitHub Actions, CI/CD</li>
              <li><strong>Outros:</strong> Git, REST APIs, GraphQL, Testes Automatizados</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Interesses & Paixões</h2>
            <p>
              Além de programação, tenho interesse em:
            </p>
            <ul>
              <li>Arquitetura de software e design patterns</li>
              <li>Boas práticas e clean code</li>
              <li>Open source e comunidade tech</li>
              <li>Aprendizado contínuo e inovação</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Conecte-se Comigo</h2>
            <p>
              Estou sempre aberto a conversas sobre desenvolvimento, projetos interessantes e oportunidades de colaboração!
            </p>
            <div className={styles.links}>
              <a href="https://github.com/rafaelbercam" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="mailto:seu-email@example.com">
                Email
              </a>
            </div>
          </section>
        </article>
      </main>
    </Layout>
  );
}
