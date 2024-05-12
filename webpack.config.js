// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'
import browserSyncConfig from './browserSync.config.js'
import { join } from 'node:path'
// import { fileURLToPath } from 'node:url'

const prodn = process.env.NODE_ENV === 'production'

export default {
  mode: prodn ? 'production' : 'development',
  entry: {
    ...prodn ? {} : { dev: join(process.cwd(), 'dev.js') },
    agglomerated: join(process.cwd(), 'client/index.js')
  },
  output: {
    path: join(process.cwd(), 'dist'),
    filename: '[name].js'
  },
  // cache: {
  //   type: 'filesystem',
  //   buildDependencies: {
  //     config: [__filename]
  //   }
  // },
  resolve: {
    alias: {},
    extensions: ['.mjs', '.js', '.vue'],
    mainFields: ['browser', 'module', 'main']
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-import', {}],
                  ['postcss-preset-env', {}],
                  ['tailwindcss', {
                    content: [
                      join(process.cwd(), 'client/**/*.pug'),
                      join(process.cwd(), 'vueIcons/*.vue')
                    ],
                    theme: {
                      // colors: {
                      //   'theme-blue': '#4763eb',
                      //   'theme-aqua': '#9fd6d2',
                      //   'theme-yellow': '#fffee4'
                      // }
                    }
                  }],
                  prodn ? ['cssnano', {}] : null
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-plain-loader',
            ident: 'pug-plain-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            ident: 'vue-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({ filename: '[name].css' }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
    new BrowserSyncPlugin(browserSyncConfig)
  ],
  // optimization: {
  //   ...prodn
  //     ? {
  //         minimizer: [
  //           '...',
  //           // new CssMinimizerPlugin()
  //         ]
  //       }
  //     : {}
  // },
  watchOptions: {
    ignored: '**/node_modules'
  }
}
