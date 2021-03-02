# Adventure Library Nuxt

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev
```

### `npm error` with jslib.git
If you are not able to install because of errors with the jslib repository then you can do the following: 
- delete the line with "adventurelibrary": "git..." from package.json
- run npm install to make sure that's the only blocker
- cd into the director you cloned jslib to
- run npm link
- cd back to advl-nuxt directory
- run npm link adventurelibrary
- run npm run dev

## Developers FAQ

### How can I develop the `jslib` library alongside this?
Use **npm link** for this. First you clone the jslib library, then you npm link it to this project.

```bash
git clone git@github.com:adventurelibrary/jslib.git
cd jslib
npm init
cd /where/you/have/nuxt-site
npm link adventurelibrary
cd /where/you/have/jslib

# This will rebuild the exported JS when you modify the TS
npm run watch
```

### Why isn't the app reloading when I change TypeScript types in jslib?
If you change .ts files and it changes some functions, nuxt will detect that change and rebuild the app.
 
If you change a TS file that _only_ contains types and interfaces, that change will not be detected by nuxt, and will not rebuild.

You have to restart `npm run dev` if you change a type, _or_ you can add fake function to your file that holds only types.

### Where do I add a new component?
If it is sitewide, such as a pagination component, put it in /components

If it is specific to a certain module, like Users, put it in /modules/users/components

### How do I do requests to the API?
I use a type of object called an **ajax**. It holds three key points of data

 - `error`: a string showing the error message from the server
 - `loading`: a boolean to show the request is being made
 - `data`: any data to be returned by the server
 
You can use the `newAjax()` function to create a new object that has these properties.

You can use the `doAjax` function to perform a request to the server and have loading, error, and data filled automatically.
 
