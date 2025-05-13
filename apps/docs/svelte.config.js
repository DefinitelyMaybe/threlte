import { vitePreprocess } from '@astrojs/svelte'

export default {
  extensions: ['.svelte', '.svelte.ts', '.svelte.js'],
  preprocess: vitePreprocess({
    postcss: true
  })
}
