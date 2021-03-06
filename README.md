# start-release


[![npm](https://img.shields.io/npm/v/start-release.svg?style=flat-square)](https://www.npmjs.com/package/start-release)
[![linux build](https://img.shields.io/circleci/project/github/effervescentia/start-release/master.svg?label=linux&style=flat-square)](https://circleci.com/gh/effervescentia/start-release)
[![windows build](https://img.shields.io/appveyor/ci/effervescentia/start-release/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/effervescentia/start-release)
[![coverage](https://img.shields.io/codecov/c/github/effervescentia/start-release/master.svg?style=flat-square)](https://codecov.io/github/effervescentia/start-release)
[![deps](https://david-dm.org/effervescentia/start-release.svg?style=flat-square)](https://david-dm.org/effervescentia/start-release)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![greenkeeper](https://badges.greenkeeper.io/effervescentia/start-release.svg)](https://greenkeeper.io/)

🚀 [Semantic Release][semantic-release] task for [Start][start]

[semantic-release]: https://github.com/semantic-release/semantic-release
[start]: https://github.com/start-runner/start

## Install

```sh
# install semantic-release-cli globally in order
# to setup your repo
npm install -g semantic-release-cli
# or
yarn global add semantic-release-cli

npm install --save-dev start-release
# or
yarn add --dev start-release
```

## Setup semantic-release

```sh
semantic-release-cli setup
```

## Setup conditions
If not running on Travis CI, you will have to specify a package for verification.

```sh
npm install --save-dev condition-circle
# or
yarn add --dev condition-circle
```

In your `package.json`

```json
"release": {
   "verifyConditions": "condition-circle"
}
```

Condition libraries:

-   [condition-circle](https://github.com/bahmutov/condition-circle)
-   [condition-snap](https://github.com/ocombe/condition-snap)
-   [@taw/condition-vsts](https://github.com/agilityworks-uk/condition-vsts)
-   [condition-appveyor](https://github.com/cwharris/condition-appveyor)
-   [sr-condition-wercker](https://github.com/io-monad/sr-condition-wercker)

## Usage

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import release from 'start-release';

const start = Start(reporter());

export const task = () => start(
  files([ 'lib/**/*.js', 'test/**/*.js' ]),
  release()
);
```

## Arguments

`release(opts)`

*   `opts.options` - the same options that semantic release accepts as seen
    [here](https://github.com/semantic-release/semantic-release#options)
*   `opts.public` - publish your scoped package publically (*default*: `false`)
