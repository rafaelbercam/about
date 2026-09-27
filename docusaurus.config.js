// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rafael Bercam',
  tagline: 'Desenvolvedor de software | Engenharia, arquitetura e boas práticas',
  favicon: 'img/favicon.ico',

  url: 'https://rafaelbercam.github.io',
  baseUrl: '/about/',

  organizationName: 'rafaelbercam',
  projectName: 'about',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
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
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/rafaelbercam/about/tree/main/',
          blogSidebarCount: 0,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Rafael Bercam',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/projetos', label: 'Projetos', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/sobre', label: 'Sobre', position: 'left'},
          {
            href: 'https://github.com/rafaelbercam',
            label: 'GitHub',
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
              {label: 'Documentação', to: '/docs/intro'},
              {label: 'Projetos', to: '/projetos'},
              {label: 'Blog', to: '/blog'},
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
                href: 'https://linkedin.com/in/seu-perfil',
              },
            ],
          },
          {
            title: 'Mais',
            items: [
              {
                label: 'Sobre mim',
                to: '/sobre',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Rafael Bercam. Construído com Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
