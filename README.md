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

# Routing
The `pages` folder is used to generate the routes of the site. A file at `pages/users.vue` will be available at the route `/users`

Folder structure is preserved. Files named `index.vue` will serve as folder indexes.

Using a _ before the filename enables route param support. A file at `pages/asset/_slug.vue` will accept routes like `asset/some-art` and the value "some-art" will be available in the routes "params".
