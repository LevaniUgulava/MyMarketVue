const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    resolve: {
      fallback: {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        url: require.resolve("url/"),
      },
    },
  },

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      "^/admin": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },

  css: {
    sourceMap: true,
  },
});
