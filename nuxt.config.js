const path = require('path')
const fs = require('fs');

const isAdmin = !!process.env.ADMIN && process.env.ADMIN !== '0'
const useSSR = !!process.env.SSR && process.env.SSR !== '0'

console.log('API', process.env.ADVL_BASE_URL)
console.log('PORT', process.env.PORT)
console.log('SSR', useSSR)

let server
if (process.env.NODE_ENV === 'production') {
	server ={
		host: '0.0.0.0',
		https: {
			key: fs.readFileSync('privkey.pem'),
			cert: fs.readFileSync('cert.pem')
		}
	}
}

const css = [
  'assets/coolicons/coolicons.css',
   // @import and additional .scss files in styles.scss
  'styles/styles.scss'
]
const ignore = [
  'pages/**/-components/*'
]
const plugins = [
  'mixins/global.ts',
  {
    src: './plugins/vue-gtag.ts',
    mode: 'client'
  }
]

if (!isAdmin) {
  ignore.push('pages/admin/*.vue')
  ignore.push('layouts/admin.vue')
} else {
  css.push('styles/admin.scss')
  //css.push('@coreui/coreui/scss/coreui.scss')
  plugins.push({
    src: 'plugins/admin',
    mode: 'client'
  })
}

export default {
  ssr: useSSR,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Adventure Library',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon-16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicon-48.png', sizes: '48x48' },
      { rel: 'icon', type: 'image/png', href: '/favicon-72.png', sizes: '72x72' },
      { rel: 'icon', type: 'image/png', href: '/favicon-96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: '/favicon-512.png', sizes: '512x512' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
    ]
  },

  dev: false,

  env: {
    ADVL_BASE_URL: process.env.ADVL_BASE_URL,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  },

  performance: {
    gzip: false
  },

  router: {
    middleware: 'auth',
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
  server: server
}
