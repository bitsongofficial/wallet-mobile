module.exports = function (api) {
	api.cache(true)
	return {
		presets: ["module:metro-react-native-babel-preset", "babel-preset-expo"],
		plugins: [
			["babel-plugin-inline-import", { extensions: [".svg"] }],
			["@babel/plugin-transform-flow-strip-types"], // https://github.com/react-navigation/react-navigation/issues/6058#issuecomment-583737009
			[
				"module-resolver",
				{
					root: "./",
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
						core: "./core",
						modals: "./modals",
					},
				},
			],
			["react-native-reanimated/plugin"],
		],
	}
}
