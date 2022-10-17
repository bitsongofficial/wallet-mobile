#!/usr/bin/env bash

SetAppSecretFromEnvToFile () {
	value=${!1}
	if [[ -n "$value" ]]; then
		sed -i -r "s/\{Your app secret here\}/$value/" $2
	fi
}

SetAppSecretFromEnv () {
	SetAppSecretFromEnvToFile APPCENTERSECRET_IOS "./ios/AppCenter-Config.plist"
	SetAppSecretFromEnvToFile APPCENTERSECRET_ANDROID "./android/app/src/main/assets/appcenter-config.json"
}

# yarn setup
yarn env
SetAppSecretFromEnv
# yarn build