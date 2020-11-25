<p align="center">
  <img
    width="280"
    src="https://user-images.githubusercontent.com/10298932/59419196-af91f800-8dca-11e9-9ea8-de5567e9e471.png"
    alt=""
  >
</p>

<h1 align="center">Vue CLI Plugin With Midway Hooks Development</h1>

<p align="center">This plugin is meant to provide all <a href="https://www.npmjs.com/package/@midwayjs/faas-dev-pack">@midwayjs/faas-dev-pack</a> options to vue-cli.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-cli-plugin-midway-hooks"><img src="https://img.shields.io/npm/v/vue3-cli-plugin-midway-hooks.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/vue3-cli-plugin-midway-hooks"><img src="https://img.shields.io/npm/dw/vue3-cli-plugin-midway-hooks.svg?style=flat-square" alt="NPM Downloads"></a>
  <a href="https://github.com/assurance-maladie-digital/vue3-cli-plugin-midway-hooks/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License"></a>
</p>


## Installation

``` bash
yarn add vue3-cli-plugin-midway-hooks
# OR npm install vue3-cli-plugin-midway-hooks
```

## Usage

```js
// vue.config.js
module.exports = {
  pluginOptions: {
    isHooks: true, // use hooks
    faas: {
      // ...
    }
  }
}
```

## Options

See [midway faas dev pack](https://github.com/midwayjs/midway-faas/tree/master/packages/faas-dev-pack) for `options` object to pass to the plugin.

### Object examples

* default value, you can overwrite it.

```js
// vue.config.js
module.exports = {
  pluginOptions: {
    faas: {
      sourceDir: 'src/apis',
      // ignore function name
      ignoreWildcardFunctions: ['render'],
      // ignore pattern
      ignorePattern: (req) => {
        const { pathname } = URL.parse(req.url);
        return /\.(js|css|map|json|png|jpg|jpeg|gif|svg|eot|woff2|ttf)$/.test(pathname);
      }
    },
    isHooks: true,
    hooksRule: ['ts', 'js']
  }
}
```

## License

Vue CLI Plugin Midway Hooks is licensed under [MIT License](./LICENSE).