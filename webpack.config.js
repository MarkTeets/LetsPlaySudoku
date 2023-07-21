const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.tsx',

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './src/client/index.html'
    })
  ],

  devServer: {
    // host: 'localhost',
    port: 8080,

    static: {
      // match the output path
      directory: path.join(__dirname, '/dist')
    },

    // headers: { 'Access-Control-Allow-Origin': '*' },

    proxy: {
      '/api/**': {
        target: 'http://localhost:3000/',
        secure: false
      }
    },
    // for react router
    historyApiFallback: true
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: [
      {
        test: /.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: ['ts-loader'],
        type: 'javascript/auto'
      },
      {
        test: /.(css|s[ac]ss)$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
