import { useExpressDevPack } from '@midwayjs/faas-dev-pack'
import URL from 'url'
import { resolve } from 'path'
import type { ServicePlugin } from '@vue/cli-service'

export type DevPackOptions = Partial<Parameters<typeof useExpressDevPack>[0]>

const defaultOptions: DevPackOptions = {
  functionDir: process.cwd(),
  sourceDir: resolve(process.cwd(), 'src/apis'),
  // 忽略渲染函数
  ignoreWildcardFunctions: ['render-index'],
  ignorePattern: (req) => {
    const { pathname } = URL.parse(req.url)
    return /\.(js|css|map|json|png|jpg|jpeg|gif|svg|eot|woff2|ttf)$/.test(pathname)
  },
}

const HooksPlugin: ServicePlugin = async (api, options) => {
  // setup midway hooks local dev server
  const devServer = options.devServer as any
  if (devServer) {
    const originDevServerBefore = devServer?.before
    devServer.before = (app, ...args) => {
      app.use(useExpressDevPack(Object.assign({}, defaultOptions, (options as any).hooks)))
      originDevServerBefore?.(app, ...args)
    }
  }

  // setup midway hooks loader
  api.chainWebpack((config) => {
    const MidwayHooksLoader = require.resolve('@midwayjs/hooks-loader')
    ;['js', 'ts'].forEach((type) => {
      config.module.rule(type).use('midway-hooks').loader(MidwayHooksLoader)
    })
  })
}

module.exports = HooksPlugin
