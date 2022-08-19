const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")

module.exports = {
  entry: `./src/pre-get.development.js`,
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.json'],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: `./index.development.js`,
    chunkFilename: "[name]-[chunkhash].js",
    libraryTarget: "umd",
    library: "preget"
  },
  module: {
    rules: [
      { parser: { system: false } },
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(process.cwd(), "babel.config.js"),
              babelrc: false
            }
          }
        ]
      },
    ]
  },
  plugins: [
    ...[process.env.NODE_ENV === "development" && new HtmlPlugin()].filter(item => item)
  ]
};
