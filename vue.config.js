const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // Your backend (Laravel) URL
        changeOrigin: true, // Handles host header changes
        pathRewrite: { "^/api": "" }, // Rewrites "/api" prefix if not used in the backend
      },
    },
  },
});
