const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

let env = {
   'production': true,
   'development': false,
}

let BUILD_DIR = path.resolve('dist');
let APP_DIR = path.resolve(__dirname, 'src');

let getConfig = (env = {
   development: true
}, argv) => {
   let config_output = {
      mode: (env.production || env.test) ? 'production' : 'development',
      entry: "/src/index.js",
      output: {
         path: BUILD_DIR,
         publicPath: 'auto'
      },
      devtool: 'source-map',
      module: {
         rules: [{
               test: /\.(js|jsx)$/,
               exclude: /node_modules/,
               resolve: {
                  extensions: [".js", ".jsx"]
               },
               use: {
                  loader: "babel-loader"
               },
            },
            {
               test: /\.(otf|ttf|png|jpg|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
               use: [{
                  loader: 'file-loader',
                  options: {
                     name: "[name].[ext]",
                     outputPath: 'img',
                  }
               }]
            },
            {
               test: /\.svg$/i,
               type: 'asset',
               resourceQuery: /url/, // *.svg?url
            },
            {
               test: /\.svg$/i,
               issuer: /\.[jt]sx?$/,
               resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
               use: ['@svgr/webpack'],
             },
         ],
      },
      optimization: {
         splitChunks: {
            chunks: 'all',
            cacheGroups: {
               defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
               },
               data: {
                  test: /\.json$/,
                  filename:'configs.bundle.js'
               }
            }
         }
      },
      plugins: [
         new HtmlWebPackPlugin({
            filename: path.join(BUILD_DIR, '/index.html'),
            template: path.join(APP_DIR, 'index.html'),
         }),
         new ESLintPlugin(),
         new Dotenv()
      ],

      devServer: {
         static: {
            directory: path.join(__dirname, 'public'),
         },
         compress: true,
         port: 8080,
         allowedHosts: 'all',
         host: '0.0.0.0',
         historyApiFallback: true,
      }
   };

   return config_output
}

module.exports = getConfig