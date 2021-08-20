const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const path = require("path");

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/imports.styl")]
    });
}

module.exports = {
  filenameHashing: false,
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()]
  },
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("stylus").oneOf(type))
    );
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
  devServer: {
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        fiber: require("fibers"),
        prependData: '@import "@/scss/settings.scss";'
      }
    }
  }
};
