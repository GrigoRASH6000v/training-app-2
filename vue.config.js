const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/training-app-2/dist/'
    : '/'
});
