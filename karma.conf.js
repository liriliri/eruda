const webpackCfg = require('./build/webpack.dev')
webpackCfg.devtool = 'inline-source-map'
webpackCfg.module.rules.push({
  test: /\.js$/,
  exclude: /node_modules|lib\/util\.js/,
  loader: '@jsdevtools/coverage-istanbul-loader',
  enforce: 'post',
  options: {
    esModules: true,
  },
})

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jquery-1.8.3'],
    files: [
      'src/index.js',
      'test/init.js',
      'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
      'node_modules/karma-jasmine/lib/boot.js',
      'node_modules/karma-jasmine/lib/adapter.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'test/util.js',
      'test/console.js',
      'test/elements.js',
      'test/info.js',
      'test/network.js',
      'test/resources.js',
      'test/storage.js',
      'test/snippets.js',
      'test/sources.js',
      'test/settings.js',
      'test/eruda.js',
    ],
    plugins: [
      'karma-jasmine',
      'karma-jquery',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
    ],
    webpackServer: {
      noInfo: true,
    },
    preprocessors: {
      'src/index.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackCfg,
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text', 'text-summary'],
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
  })
}
