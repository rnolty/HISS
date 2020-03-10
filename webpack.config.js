const path = require("path");
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "frontend", "index.js"),
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.html$/,
            use: [
              {
                 loader: "html-loader"
              }
            ]
          }        
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js",
        publicPath: "/"
    }, 
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "./frontend/public/index.html",
            filename: "./index.html"
        })
    ],
    devServer: {
        hot: true,
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'frontend', 'public')
    },
    mode: "development"
};
