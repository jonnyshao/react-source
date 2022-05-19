const {
  override,
  addBabelPlugin,
  addDecoratorsLegacy,
  disableEsLint,
} = require("customize-cra");
module.exports = override(
  addBabelPlugin(["@babel/plugin-proposal-decorators", { version: "legacy" }])
  //   addBabelPlugin(),
  // disableEsLint(),
  // addDecoratorsLegacy()
);
