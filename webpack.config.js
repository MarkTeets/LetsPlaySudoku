const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: './client/index.js', 

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './client/index.html'
    })
  ],

  devServer: {
    // host: 'localhost',
    // port: 8080,
    // // enable HMR on the devServer
    // hot: true,
    // // fallback to root for other urls
    // historyApiFallback: true,

    // static: {
    //   // match the output path
    //   directory: path.resolve(__dirname, 'dist'),
    //   // match the output 'publicPath'
    //   publicPath: '/',
    // },

    // headers: { 'Access-Control-Allow-Origin': '*' },

    proxy: {
      '/api/**': {
        target: 'http://localhost:1234/',
        secure: false,
      },
    },
    // for react router if you use it
    // historyApiFallback: true
  },
  
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }

}