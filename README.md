# Adventure Library Nuxt

## Public Site
```
npm i
npm run dev
```

## Admin Site
```
npm run dev-admin
```

## Deploy

```
npm i
npm run build
npm start
```

# Modules
A "module" represents a grouping of logic and components, generally related to a specific data item: User, Asset, Bundle, etc.

Each module folder has TypeScript code in its root, and Vue components in a `components` folder.

A rule of thumb for where a file pertaining to a module should go is:
 - Is it a page someone should be able to navigate to? If yes, it's probably meant to go in the `pages` directory explained below.
 - Does it render a Vue template or HTML onto the page? If yes, it should be a .vue file in components.
 - Is it TypeScript logic that could be used regardless of framework? If yes, it should be a .ts file in the module's root.

# Routing
The `pages` folder is used to generate the routes of the site. A file at `pages/users.vue` will be available at the route `/users`

Folder structure is preserved. Files named `index.vue` will serve as folder indexes.

Using a _ before the filename enables route param support. A file at `pages/asset/_slug.vue` will accept routes like `asset/some-art` and the value "some-art" will be available in the routes "params".
