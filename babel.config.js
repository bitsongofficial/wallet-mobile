module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-flow-strip-types"], // https://github.com/react-navigation/react-navigation/issues/6058#issuecomment-583737009
      [
        "module-resolver",
        {
          alias: {
            assets: "./assets",
            components: "./components",
            utils: "./utils",
            src: "./src",
            api: "./api",
            constants: "./constants",
            hooks: "./hooks",
            navigation: "./navigation",
            screens: "./screens",
            classes: "./classes",
            stores: "./stores",
          },
        },
      ],
      ["react-native-reanimated/plugin"],
    ],
  };
};
