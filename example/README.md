# How to add the library to your NodeJS project

For local development:

- open terminal in the main library directory
- `npm link`
- open terminal in the directory with example project
- `npm link react-fast-context-store`

or

- add in the package.json dependecies
- `"react-fast-context-store": "link:.."`
- reinstall packages
- `yarn` / `npm install`

For production:

- open terminal in the main directory of your project
- `npm i react-fast-context-store`
