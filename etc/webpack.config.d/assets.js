/** @type {import('webpack').Configuration} */
export default {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset",
        generator: { filename: 'img/[name].[contenthash][ext]' },
      },
      {
        test: /\.(svg)$/i,
        type: "asset/resource",
        generator: { filename: 'img/[name].[contenthash][ext]' },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        type: "asset",
        generator: { filename: 'fonts/[name].[contenthash][ext]' },
      }
    ]
  }
};
