// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rafael Bercam',
  tagline: 'Desenvolvedor de software | Engenharia, arquitetura e boas práticas',
  favicon: 'img/favicon-512.png',

  url: 'https://rafaelbercam.github.io',
  baseUrl: '/about/',

  organizationName: 'rafaelbercam',
  projectName: 'about',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/rafaelbercam/about/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['pt'],
        indexBlog: true,
        indexPages: true,
      },
    ],
  ],

  plugins: [
    // Google Analytics desabilitado em desenvolvimento
    // Adicione seu tracking ID aqui quando for deployar
    // [
    //   '@docusaurus/plugin-google-gtag',
    //   {
    //     trackingID: 'G-SEU-ID-AQUI',
    //     anonymizeIP: true,
    //   },
    // ],
  ],

  headTags: [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Rafael Berçam',
        logo: {
          alt: 'Rafael Berçam',
          src: 'img/favicon-512.png',
          width: 40,
          height: 40,
        },
        items: [
          {
            to: '/docs/intro',
            label: 'Docs',
            position: 'left',
          },
          {
            href: 'https://rafaelbercam.github.io/',
            label: 'Currículo',
            position: 'right',
          },
          {
            href: 'https://github.com/rafaelbercam',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/rafaelbercam/',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Conteúdo',
            items: [
              {label: 'Sobre', to: '/docs/intro'},
              {label: 'Projetos', to: '/docs/projetos/'},
              {label: 'Blog', to: '/docs/blog/'},
            ],
          },
          {
            title: 'Social',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/rafaelbercam',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/rafaelbercam/',
              },
              {
                label: 'Email',
                href: 'mailto:faelbercam@gmail.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Rafael Bercam.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
