"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faas_dev_pack_1 = require("@midwayjs/faas-dev-pack");
const url_1 = __importDefault(require("url"));
const path_1 = require("path");
const defaultOptions = {
    functionDir: process.cwd(),
    sourceDir: path_1.resolve(process.cwd(), 'src/apis'),
    // 忽略渲染函数
    ignoreWildcardFunctions: ['render-index'],
    ignorePattern: (req) => {
        const { pathname } = url_1.default.parse(req.url);
        return /\.(js|css|map|json|png|jpg|jpeg|gif|svg|eot|woff2|ttf)$/.test(pathname);
    },
};
const HooksPlugin = (api, options) => __awaiter(void 0, void 0, void 0, function* () {
    // setup midway hooks local dev server
    const devServer = options.devServer;
    if (devServer) {
        const originDevServerBefore = devServer === null || devServer === void 0 ? void 0 : devServer.before;
        devServer.before = (app, ...args) => {
            app.use(faas_dev_pack_1.useExpressDevPack(Object.assign({}, defaultOptions, options.hooks)));
            originDevServerBefore === null || originDevServerBefore === void 0 ? void 0 : originDevServerBefore(app, ...args);
        };
    }
    // setup midway hooks loader
    api.chainWebpack((config) => {
        const MidwayHooksLoader = require.resolve('@midwayjs/hooks-loader');
        ['js', 'ts'].forEach((type) => {
            config.module.rule(type).use('midway-hooks').loader(MidwayHooksLoader);
        });
    });
});
module.exports = HooksPlugin;
