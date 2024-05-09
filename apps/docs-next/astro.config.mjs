import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Threlte',
      logo: {
        src: './public/logo/threlte-logo.png',
        alt: 'cube pyramid',
        replacesTitle: true
      },
      social: {
        github: 'https://github.com/threlte/threlte',
        discord: 'https://discord.gg/EqUBCfCaGm',
        twitter: 'https://twitter.com/threlte'
      },
      customCss: ['./src/styles/app.css'],
      sidebar: [
        {
          label: 'Learn',
          autogenerate: {
            directory: 'learn'
          }
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference'
          }
        }
      ],
      defaultLocale: 'en',
      locales: {
        // English docs in `src/content/docs/en/`
        en: {
          label: 'English'
        }
      },
      editLink: {
        baseUrl: 'https://github.com/threlte/threlte/edit/main/apps/docs'
      }
    }),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false
    })
  ]
})
