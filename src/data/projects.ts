export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  repoUrl: string;
  demoUrl?: string;
  docsUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 'projeto-exemplo-1',
    title: 'Projeto Exemplo 1',
    description:
      'Descrição breve do seu primeiro projeto pessoal. Mencione as principais features e desafios técnicos.',
    stack: ['TypeScript', 'React', 'Node.js'],
    repoUrl: 'https://github.com/rafaelbercam/project-1',
    demoUrl: 'https://project-1-demo.vercel.app',
    docsUrl: '/about/docs/projeto-exemplo',
  },
  {
    id: 'projeto-exemplo-2',
    title: 'Projeto Exemplo 2',
    description:
      'Descrição breve de outro projeto. Destaque as tecnologias e aprendizados principais.',
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
    repoUrl: 'https://github.com/rafaelbercam/project-2',
    docsUrl: '/about/docs/projeto-exemplo',
  },
  {
    id: 'projeto-exemplo-3',
    title: 'Projeto Exemplo 3',
    description:
      'Mais um projeto legal para demonstrar sua versatilidade e experiência em diferentes áreas.',
    stack: ['Go', 'Docker', 'Kubernetes'],
    repoUrl: 'https://github.com/rafaelbercam/project-3',
    demoUrl: 'https://project-3.example.com',
  },
];
