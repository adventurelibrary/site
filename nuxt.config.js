const path = require('path')

const isAdmin = !!process.env.ADMIN && process.env.ADMIN !== '0'

const css = [
  'assets/coolicons/coolicons.css',
  'styles/color.scss',
  'styles/layout.scss',
  'styles/base-page.scss',
  'styles/search.scss',
  'styles/search-results.scss',
  'styles/styles.scss'
]
const ignore = []
const plugins = [
  'mixins/global.ts'
]

if (!isAdmin) {
  ignore.push('pages/admin/*.vue')
  ignore.push('layouts/admin.vue')
} else {
  css.push('styles/admin.scss')
  css.push('@coreui/coreui/scss/coreui.scss')
  plugins.push({
    src: 'plugins/admin',
    mode: 'client'
  })
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
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
    analyze: false
  },
  css: css,
  plugins: plugins,
  ignore: ignore,
}
