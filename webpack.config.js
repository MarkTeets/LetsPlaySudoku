// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
  mode: process.env.NODE_ENV,

  devServer: {
    // Required for Docker to work with dev server
    host: '0.0.0.0',
    // host: 'localhost',
    port: 8080,
    //enable HMR on the devServer
    hot: true,
    // for react router
    historyApiFallback: true,

    static: {
      // match the output path
      directory: path.join(__dirname, '/dist'),
      //match the output 'publicPath'
      publicPath: '/'
    },

    headers: { 'Access-Control-Allow-Origin': '*' },

    proxy: {
      '/api/**': {
        target: 'http://localhost:3000/',
        secure: false
      },
      '/assets/**': {
        target: 'http://localhost:3000/',
        secure: false
      }
    }
  },

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
