const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.0.109:8001",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
