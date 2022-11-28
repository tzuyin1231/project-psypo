const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        // 這個api應該是跟baseUrl的api一樣
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": "api", // 後面"api"是跟後端的controller api有關
        },
      },
    },
  },
};
