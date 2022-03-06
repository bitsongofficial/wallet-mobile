module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
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
          },
        },
      ],
    ],
  };
};
