import styles from './styles.module.css';

export default function AboutContent(): JSX.Element {
  return (
    <main className={styles.container}>
      <article className={styles.content}>
        <h1>Sobre Mim</h1>

        <section className={styles.section}>
          <h2>Quem Sou</h2>
          <p>
            Olá! Meu nome é Rafael Bercam. Sou Engenheiro de Software especializado em SDET (Software Development Engineer in Test),
            apaixonado por criar soluções elegantes, robustas e confiáveis para problemas complexos.
          </p>
          <p>
            Com experiência em desenvolvimento full-stack e automação de testes em escala, tenho atuado em projetos que variam desde
            aplicações web modernas até sistemas backend escaláveis com qualidade garantida. Minha abordagem combina boas
            práticas de engenharia de software, testes automatizados de alto nível, atenção aos detalhes e foco em confiabilidade.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Experiência & Habilidades</h2>
          <p>
            Tenho experiência com diversas tecnologias e linguagens de programação:
          </p>
          <ul>
            <li><strong>SDET/QA Automation:</strong> Frameworks de teste, automação end-to-end, testes de API, CI/CD pipelines</li>
            <li><strong>Frontend:</strong> React, TypeScript, Next.js, CSS/SCSS, HTML5</li>
            <li><strong>Backend:</strong> Node.js, Python, Go, PostgreSQL, MongoDB</li>
            <li><strong>DevOps/Infra:</strong> Docker, Kubernetes, GitHub Actions, CI/CD</li>
            <li><strong>Outros:</strong> Git, REST APIs, GraphQL, Testes Automatizados, Engenharia de Confiabilidade</li>
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
            <a href="https://www.linkedin.com/in/rafaelbercam/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:faelbercam@gmail.com">
              Email
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
