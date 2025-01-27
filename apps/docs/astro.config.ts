import starlight from '@astrojs/starlight'
// import AutoImport from 'astro-auto-import'
import { defineConfig } from 'astro/config'
import { resolve } from 'path'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypeSlug from 'rehype-slug'
// import preprocess from 'svelte-preprocess'
// import mkcert from 'vite-plugin-mkcert'
// import { threlteStudio } from '@threlte/studio/vite'
// import type { Plugin } from 'vite'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
// import preact from '@astrojs/preact'
import svelte from '@astrojs/svelte'

// https://astro.build/config
// import mdx from '@astrojs/mdx'

const noExternal = ['three', 'troika-three-text', 'postprocessing', '@pmndrs/vanilla']
if (process.env.NODE_ENV === 'production') {
  noExternal.push('@theatre/core')
}

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  experimental: {
    clientPrerender: true
  },
  build: {
    inlineStylesheets: 'never'
  },
  integrations: [
    starlight({
      title: 'Threlte',
      logo: {
        src: '$assets/logo/threlte-logo.png',
        replacesTitle: true
      },
      favicon: '/icons/favicon.ico',
      social: {
        github: 'https://github.com/threlte/threlte',
        twitter: 'https://twitter.com/threlte',
        discord: 'https://discord.gg/EqUBCfCaGm'
      },
      customCss: ['src/styles/app.css', '@fontsource/inter/400.css'],
      // components: {
      //   Head: '$components/Head.astro',
      //   Header: '$components/Header.astro',
      //   Sidebar: '$components/Sidebar.astro',
      //   MobileMenuFooter: '$components/MobileMenuFooter.astro',
      //   MarkdownContent: '$components/MarkdownContent.astro'
      // },
      // sidebar: [
      //   {
      //     label: 'learn',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         autogenerate: {
      //           directory: 'learn/getting-started'
      //         }
      //       },
      //       {
      //         label: 'Basics',
      //         autogenerate: {
      //           directory: 'learn/basics'
      //         }
      //       },
      //       {
      //         label: 'Advanced',
      //         autogenerate: {
      //           directory: 'learn/advanced'
      //         }
      //       },
      //       {
      //         label: 'More',
      //         autogenerate: {
      //           directory: 'learn/more'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'examples',
      //     autogenerate: {
      //       directory: 'examples'
      //     }
      //   },
      //   {
      //     label: 'core',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/core/getting-started'
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/core/components'
      //         }
      //       },
      //       {
      //         label: 'Hooks',
      //         autogenerate: {
      //           directory: 'reference/core/hooks'
      //         }
      //       },
      //       {
      //         label: 'Helpers',
      //         autogenerate: {
      //           directory: 'reference/core/helpers'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'extras',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/extras/getting-started'
      //       },
      //       {
      //         label: 'Audio',
      //         autogenerate: {
      //           directory: 'reference/extras/audio'
      //         }
      //       },
      //       {
      //         label: 'Content',
      //         autogenerate: {
      //           directory: 'reference/extras/content'
      //         }
      //       },
      //       {
      //         label: 'Interaction',
      //         autogenerate: {
      //           directory: 'reference/extras/interaction'
      //         }
      //       },
      //       {
      //         label: 'Loading',
      //         autogenerate: {
      //           directory: 'reference/extras/loading'
      //         }
      //       },
      //       {
      //         label: 'Performance',
      //         autogenerate: {
      //           directory: 'reference/extras/performance'
      //         }
      //       },
      //       {
      //         label: 'Staging',
      //         autogenerate: {
      //           directory: 'reference/extras/staging'
      //         }
      //       },
      //       {
      //         label: 'Visual Effects',
      //         autogenerate: {
      //           directory: 'reference/extras/vfx'
      //         }
      //       },
      //       {
      //         label: 'Misc',
      //         autogenerate: {
      //           directory: 'reference/extras/misc'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'gltf',
      //     autogenerate: {
      //       directory: 'reference/gltf'
      //     }
      //   },
      //   {
      //     label: 'rapier',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/rapier/getting-started'
      //       },
      //       {
      //         label: 'Concepts',
      //         autogenerate: {
      //           directory: 'reference/rapier/concepts'
      //         }
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/rapier/components'
      //         }
      //       },
      //       {
      //         label: 'Hooks',
      //         autogenerate: {
      //           directory: 'reference/rapier/hooks'
      //         }
      //       },
      //       {
      //         label: 'Joints',
      //         autogenerate: {
      //           directory: 'reference/rapier/joints'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'theatre',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/theatre/getting-started'
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/theatre/components'
      //         }
      //       },
      //       {
      //         label: 'Sheet Object',
      //         autogenerate: {
      //           directory: 'reference/theatre/sheet-object'
      //         }
      //       },
      //       {
      //         label: 'Hooks',
      //         autogenerate: {
      //           directory: 'reference/theatre/hooks'
      //         }
      //       },
      //       {
      //         label: 'Actions',
      //         autogenerate: {
      //           directory: 'reference/theatre/actions'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'flex',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/flex/getting-started'
      //       },
      //       {
      //         label: 'Examples',
      //         link: 'reference/flex/examples'
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/flex/components'
      //         }
      //       },
      //       {
      //         label: 'Utilities',
      //         autogenerate: {
      //           directory: 'reference/flex/utilities'
      //         }
      //       },
      //       {
      //         label: 'Hooks',
      //         autogenerate: {
      //           directory: 'reference/flex/hooks'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'xr',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         link: 'reference/xr/getting-started'
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/xr/components'
      //         }
      //       },
      //       {
      //         label: 'Controls',
      //         autogenerate: {
      //           directory: 'reference/xr/controls'
      //         }
      //       },
      //       {
      //         label: 'Hooks',
      //         autogenerate: {
      //           directory: 'reference/xr/hooks'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     label: 'studio',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         autogenerate: {
      //           directory: 'reference/studio/getting-started'
      //         }
      //       },
      //       {
      //         label: 'Components',
      //         autogenerate: {
      //           directory: 'reference/studio/components'
      //         }
      //       },
      //       {
      //         label: 'Extensions',
      //         autogenerate: {
      //           directory: 'reference/studio/extensions'
      //         }
      //       }
      //     ]
      //   }
      // ],
      // locales: {
      //   root: {
      //     lang: 'en',
      //     label: 'English'
      //   },
      //   de: {
      //     label: 'German',
      //     lang: 'de'
      //   }
      // },
      editLink: {
        baseUrl: 'https://github.com/threlte/threlte/edit/main/apps/docs'
      },
      expressiveCode: {
        themes: ['dracula-soft']
      }
      // plugins: [starlightLinksValidator()]
    }),
    // AutoImport({
    //   imports: [
    //     '$components/Example/Example.astro',
    //     '$components/Tip/Tip.astro',
    //     '$components/Card/Card.astro'
    //   ]
    // }),
    tailwind({
      // Disable the default base styles:
      applyBaseStyles: false
    }),
    svelte()
    // svelte({
    //   preprocess: preprocess({
    //     postcss: true
    //   })
    // }),
    // mdx({
    //   rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
    // }),
    // preact({ compat: true, include: ['**/*.tsx'] })
  ],
  output: 'static',
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
    },
    // Use https and generate a cert to allow XR debugging.
    server: {
      ...(process.argv.includes('--https') ? { https: {} } : {})
    },
    // plugins: process.argv.includes('--https')
    //   ? [threlteStudio() as unknown as Plugin, mkcert()]
    //   : [threlteStudio() as unknown as Plugin],
    ssr: {
      // "@theatre/core" needs to be externalized in development mode but not in production!
      noExternal: noExternal
    },
    legacy: {
      // vite 5 changed how externalized modules work - need to use this flag to keep old behaviour
      // https://vitejs.dev/guide/migration#ssr-externalized-modules-value-now-matches-production
      proxySsrExternalModules: true
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        keep_classnames: true
      }
    }
  },
  markdown: {
    syntaxHighlight: false
    // rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]]
  }
})
