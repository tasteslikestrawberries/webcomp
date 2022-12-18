module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // Exclude JavaScript files in the 'node_modules' directory
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"], // Use the '@babel/preset-env' preset to transpile modern JavaScript code to an older version
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "lazyStyleTag",

              insert: (element, options) => {
                const parent = options.target || document.head;

                parent.appendChild(element);
              },
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: ["", ".js", ".css"],
  },
  output: {
    path:  "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    static: "./dist",
  },
};
