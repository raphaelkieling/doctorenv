<div align="center">
    <img src="image.png" height="100px">
</div>

# Doctorenv

> 100% WIP, please do not use it yet

Doctorenv is a checklist tool that helps developers identify environment issues and provides suggestions on how to fix them. 🐛

### Why?

Sometimes you aren't sure if you have everything to contribute in a project. The `Doctorenv` should give you some help on:

- Check what is missing in your environment to make it works
- Giving you some `Suggestions` on how to fix in case you do not met some requirements
- Easy to start using and change
- Automatic fixers

Example of config:

```js
// doctorenv.config.js
export default [
  {
    name: "Has all the environment variables",
    definitions: [
      {
        name: "MY_ENV",
        suggestions: ["execute in the root: source ./.env.local"],
        // if the checker is false, shows all the suggestion
        checker: () => process.env.MY_ENV,
      },
    ],
  },
];
```

Run:

```sh
# To check
doctorenv check

# To fix (if fixable)
doctorenv fix
```

### Programmatic usage:

```js
import { Builder } from "doctorenv";

new Builder()
  .createDefinition("Definition 1")
  .addChecker("has yarn", ({ bash }) => bash("npm --version"))
  .addChecker("has npm", () => true)
  .start();
```

### How to contribute?

Would be a pleasure to have you contributing to this project. Feel free to open a PR with your changes.

- Fork the project
- Create a branch
- Make your changes
- Open a PR

### Publishing

Based on: https://docs.npmjs.com/cli/v8/commands/npm-version

```sh
npm version patch
npm publish
```

<small>
Temporary Icon from: <a href="https://www.flaticon.com/free-icons/pharmacist" title="Pharmacist icons">Pharmacist icons created by Freepik - Flaticon</a>
</small>
