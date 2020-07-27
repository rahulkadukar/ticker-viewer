const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: path.resolve(__dirname, "public/dist/"),
    publicPath: "public/dist/",
    filename: "bundle.js"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
