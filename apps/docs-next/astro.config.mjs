import { defineConfig } from 'astro/config'
import { resolve } from 'path'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

import svelte from '@astrojs/svelte'

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
    svelte(),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false
    })
  ],
  vite: {
    resolve: {
      alias: {
        $lib: resolve('./src/lib'),
        $components: resolve('./src/components'),
        $layouts: resolve('./src/layouts'),
        $pages: resolve('./src/pages'),
        $styles: resolve('./src/styles'),
        $assets: resolve('./src/assets'),
        $examples: resolve('./src/examples'),
        $hooks: resolve('./src/hooks')
      }
    }
  }
})
