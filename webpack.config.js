const webpack = require('webpack')
const path = require('path')

const webpackConfigs = []

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    BROWSERSLIST: ['> 1%', 'last 2 versions']
  }
})

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {}
})

function generateConfig(name) {
  let minify = name.indexOf('min') !== -1

  let config = {
    entry: path.join(__dirname, 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${name}.js`,
      library: 'GistEmbedder',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'es2015']
            }
          }
        }
      ]
    },
    plugins: [definePlugin]
  }

  if (minify) config.plugins.push(uglifyPlugin)

  return config
}

;['gist-embedder', 'gist-embedder.min'].forEach(name => {
  webpackConfigs.push(generateConfig(name))
})

module.exports = webpackConfigs
