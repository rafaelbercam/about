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

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-XXXXXXXXXX', // Substituir pelo seu ID do GA4
        anonymizeIP: true,
      },
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        integrity: 'sha512-iecdLmaskl7CVJkEZSMUkrQ6usknVF4SpMwOVNNwtpSymRsswroEBWePmzKZf38lH05OWv95IrsPJ+1v0GCHQ==',
        crossOrigin: 'anonymous',
        referrerPolicy: 'no-referrer',
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Rafael Berçam',
        logo: {
          alt: 'Rafael Berçam',
          src: 'img/card.png',
          width: 40,
          height: 40,
        },
        items: [
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
        style: 'light',
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
        copyright: `Copyright © ${new Date().getFullYear()} Rafael Bercam. Construído com Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: 'XXXXXXXXXX', // Substituir
        apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Substituir
        indexName: 'rafaelbercam', // Seu index name
        contextualSearch: true,
        searchParameters: {},
      },
    }),
};

module.exports = config;
