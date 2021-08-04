const path = require("path");

module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "src/main.ts",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "模板项目",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  },
  outputDir: "dist",
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  filenameHashing: true,
  chainWebpack: config => {
    config.output
      .filename("assets/js/[name].[hash].js")
      .chunkFilename("assets/js/[name].[hash].js")
      .end();
    // 如果filenameHashing设置为了false，可以通过这段代码给打包出的css文件增加hash值
    // config.plugin('extract-css').tap(args => [{
    //   filename: 'assets/css/[name].[hash].css',
    //   chunkFilename: 'assets/css/[name].[hash].css'
    // }])
  },
  configureWebpack: config => {
    Object.assign(config.resolve, {
      alias: {
        types: path.resolve(__dirname, "./types/")
      }
    });
  },
  devServer: {
    disableHostCheck: true,
    proxy: process.env.VUE_APP_API_URL
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 设置全部变量
            hack: `true; @import "@/styles/theme.less";`
          }
        }
      }
    }
  },
  pluginOptions: {
    mock: { entry: "./mock/index.js", debug: false }
  }
};
