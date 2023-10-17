<div align="center">
    <img src="image.png" height="100px">
</div>

# Doctorenv

Doctorenv is a checklist tool that helps developers identify environment issues and provides suggestions on how to fix them. 🐛

### How to install?

```sh
# Installing globally using npn
npm i -g doctorenv-cli

# Installing globally using yarn
yarn global add doctorenv-cli

# Without install
npx doctorenv-cli
```

### Why?

Sometimes you aren't sure if you have everything to contribute in a project. The `Doctorenv` should give you some help on:

- Check what is missing in your environment to make it works
- Giving you some `Suggestions` on how to fix in case you do not met some requirements
- Easy to start using and change
- Automatic fixers

Example of config:

```js
// doctorenv.config.js
module.exports = [
  {
    name: 'Has all the environment variables',
    definitions: [
      {
        name: 'MY_ENV',
        suggestions: ['execute in the root: source ./.env.local'],
        // if the checker is false, shows all the suggestion
        checker: () => process.env.MY_ENV,
      },
    ],
  },
]
```

Run:

```sh
# To check the default doctorenv.config.js
doctorenv check

# To check with a custom config
doctorenv check <custom-path-to-config>
```

### Programmatic usage:

```js
import { Builder } from 'doctorenv'

new Builder()
  .createDefinition('Definition 1')
  .addChecker('has yarn', ({ bash }) => bash('npm --version'))
  .addChecker('has npm', () => true)
  .start()
```

### How to contribute?

Would be a pleasure to have you contributing to this project. Feel free to open a PR with your changes.

- Fork the project
- Create a branch
- Make your changes
- Open a PR

### Publishing

```sh
npm run publish
```

<small>
Temporary Icon from: <a href="https://www.flaticon.com/free-icons/pharmacist" title="Pharmacist icons">Pharmacist icons created by Freepik - Flaticon</a>
</small>
