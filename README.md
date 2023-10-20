<div align="center">
    <img src="image.png" height="100px">
</div>

# Doctorenv

![Known Vulnerabilities](https://snyk.io/test/github/raphaelkieling/doctorenv/badge.svg)
[![codecov](https://codecov.io/gh/raphaelkieling/doctorenv/graph/badge.svg?token=8FUTQY7PA7)](https://codecov.io/gh/raphaelkieling/doctorenv)

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
module.exports = ({ builder }) => {
  return builder
    .task('check package manager')
    .subTask('has npm', ({ bash }) => bash`npm --version`)
    .subTask('has yarn', ({ bash }) => bash`yarn --version`)
    .task('has env', ({ checkEnv }) => checkEnv('NODE_ENV'))
    .setFixableSuggestion(
      'Run source ./env.sh',
      ({ bash }) => bash`source ./env.sh`
    )
    .build()
}
```

Run:

```sh
# To check the default doctorenv.config.js
doctorenv check

# To check with a custom config
doctorenv check <custom-path-to-config>
```

![Alt text](image-1.png)

### How to contribute?

It's simple, just take a look at our [Contributing](CONTRIBUTING.md) guide.

### Development

```sh
# testing
npm run test
npm run test:watch

# run a specific example in dev mode
npm run dev check examples/NAME_HERE.config.js
```

### Publishing

```sh
npm run publish
```

<small>
Temporary Icon from: <a href="https://www.flaticon.com/free-icons/pharmacist" title="Pharmacist icons">Pharmacist icons created by Freepik - Flaticon</a>
</small>
