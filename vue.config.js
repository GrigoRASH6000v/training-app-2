const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  filenameHashing: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/training-app-2/docs/'
    : '/'
});
