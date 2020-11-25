const { useExpressDevPack } = require('@midwayjs/faas-dev-pack');
const URL = require('url');
const { resolve } = require('path');

module.exports = (api, options) => {
  if (options.pluginOptions) {
    const faasOpts = options.pluginOptions.faas;
    const isHooks = options.pluginOptions.isHooks;
    const hooksRule = options.pluginOptions.hooksRule;

    const before = (app) => {
      app.use(
        useExpressDevPack(
          Object.assign(
            {
              functionDir: process.cwd(),
              sourceDir: resolve(process.cwd(), 'src/apis'),
              // 忽略渲染函数
              ignoreWildcardFunctions: ['render'],
              // 忽略静态文件地址
              ignorePattern: (req) => {
                const { pathname } = URL.parse(req.url);
                return /\.(js|css|map|json|png|jpg|jpeg|gif|svg|eot|woff2|ttf)$/.test(pathname);
              },
            },
            faasOpts || {}
          )
        )
      );
    };

    if (faasOpts) {
      let mergeDevServerbefore = before;
      if (options.devServer && options.devServer.before) {
        const originDevServerBefore = options.devServer.before;
        mergeDevServerbefore = (app, server, compiler) => {
          before(app);
          originDevServerBefore(app, server, compiler);
        };
      }
      options.devServer = Object.assign(options.devServer || {}, { before: mergeDevServerbefore });
    }

    if (isHooks) {
      api.chainWebpack((config) => {
        const MidwayHooksLoader = require.resolve('@midwayjs/hooks-loader');
        (hooksRule || ['js', 'ts']).forEach((type) => {
          config.module
            .rule(type)
            .use('midway-hooks')
            .loader(MidwayHooksLoader);
        });
      });
    }
  }
};
