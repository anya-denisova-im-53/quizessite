'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var babel = require('@babel/core');
var vite = require('vite');
var fs = require('fs');
var path = require('path');

function testFilter(filter, id) {
  return typeof filter === "function" ? filter(id) : filter.test(id);
}

const esbuildPluginBabel = (options) => ({
  name: "babel",
  setup(build) {
    const { filter = /.*/, namespace = "", config = {}, loader, customFilter } = options;
    const resolveLoader = (args) => {
      if (typeof loader === "function") {
        return loader(args.path);
      }
      return loader;
    };
    const transformContents = async (args, contents) => {
      const babelOptions = babel.loadOptions({
        filename: args.path,
        ...config,
        caller: {
          name: "esbuild-plugin-babel",
          supportsStaticESM: true
        }
      });
      if (!babelOptions) {
        return { contents, loader: resolveLoader(args) };
      }
      if (babelOptions.sourceMaps) {
        babelOptions.sourceFileName = path.relative(process.cwd(), args.path);
      }
      return babel.transformAsync(contents, babelOptions).then((result) => ({
        contents: result?.code ?? "",
        loader: resolveLoader(args)
      }));
    };
    build.onLoad({ filter: /.*/, namespace }, async (args) => {
      const shouldTransform = customFilter(args.path) && testFilter(filter, args.path);
      if (!shouldTransform) return;
      const contents = await fs.promises.readFile(args.path, "utf8");
      return transformContents(args, contents);
    });
  }
});

const DEFAULT_FILTER = /\.jsx?$/;
const babelPlugin = ({
  babelConfig = {},
  filter = DEFAULT_FILTER,
  include,
  exclude,
  apply,
  enforce = "pre",
  loader
} = {}) => {
  const customFilter = vite.createFilter(include, exclude);
  return {
    name: "babel-plugin",
    apply,
    enforce,
    config() {
      return {
        optimizeDeps: {
          esbuildOptions: {
            plugins: [
              esbuildPluginBabel({
                config: { ...babelConfig },
                customFilter,
                filter,
                loader
              })
            ]
          }
        }
      };
    },
    transform(code, id) {
      const shouldTransform = customFilter(id) && testFilter(filter, id);
      if (!shouldTransform) return;
      return babel.transformAsync(code, { filename: id, ...babelConfig }).then((result) => ({ code: result?.code ?? "", map: result?.map }));
    }
  };
};

exports.default = babelPlugin;
exports.esbuildPluginBabel = esbuildPluginBabel;
