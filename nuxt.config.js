const path = require('path')

const isAdmin = !!process.env.ADMIN && process.env.ADMIN !== '0'

console.log('isAdmin', isAdmin)

const css = [
  'styles/color.scss',
  'styles/layout.scss',
  'styles/base-page.scss',
  'styles/search.scss',
  'styles/styles.scss'
]
const ignore = []
if (!isAdmin) {
  ignore.push('pages/admin/*.vue')
  ignore.push('layouts/admin.vue')
} else {
  css.push('styles/admin.scss')
}

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Adventure Library',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  dev: false,

  performance: {
    gzip: false
  },

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv'
  ],

    // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend (config) {
      const vue$ = path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js')
      config.resolve.alias['@assets'] = 'modules/assets'
      config.resolve.alias['vue$'] = vue$
    },
    analyze: true
  },
  css: css,

  ignore: ignore
}
