'use strict';

const isNil = require('lodash.isnil');
const truncate = require('lodash.truncate');
const removeMarkdown = require('remove-markdown');

require('dotenv').config();

const siteUrl = 'https://openbook.level5.co.uk';

module.exports = {
  siteMetadata: {
    title: 'Level 5 Openbook',
    sidebarTitle: 'Level 5 Openbook',
    sidebarSubtext: 'Openbook',
    siteLastUpdated: new Date().toISOString(),
    version: '3.1.1',
    siteUrl,
    keywords: 'openbook, documentation',
    author: {
      name: 'level5',
      url: 'https://level5.co.uk',
      email: 'hello@level5.co.uk'
    },
    socials: [
      {
        name: 'Twitter',
        imgpath: 'icon-twitter.svg',
        url: 'https://twitter.com/level5digital'
      },
      {
        name: 'GitHub',
        imgpath: 'icon-github.svg',
        url: 'https://github.com/levelfiveteam'
      },
      {
        name: 'LinkedIn',
        imgpath: 'icon-linkedin.svg',
        url: 'https://www.linkedin.com/company/level5digital/'
      },
    ]
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/docs`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-smartypants',
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              linkImagesToOriginal: false,
              wrapperStyle: 'margin-top: 24px; margin-bottom: 24px;'
            }
          }
        ]
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [
          {
            name: 'en',
            // A function for filtering nodes. () => true by default
            filterNodes: node => !isNil(node.frontmatter)
          }
        ],
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'content' },
          { name: 'excerpt', store: true },
          { name: 'url', store: true }
        ],
        resolvers: {
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            content: node => node.rawMarkdownBody,
            excerpt: node => {
              // remove the hella dirty markdown body and return just plain string
              return truncate(removeMarkdown(node.rawMarkdownBody).replace(/\n/g, ' '), {
                length: 150
              });
            },
            url: node => node.fields.slug
          }
        }
      }
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://openbook.level5.co.uk'
      }
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#006fe6',
        showSpinner: false
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Level 5 Openbook',
        short_name: 'Level 5 Openbook',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          }
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#f8fcff',
        background_color: '#f6f7f8'
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: process.env.GATSBY_GA_TRACKING_ID
      }
    },
    'gatsby-plugin-netlify-cache',
    'gatsby-plugin-netlify'
  ]
};
