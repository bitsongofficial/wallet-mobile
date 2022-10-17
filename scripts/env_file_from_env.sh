#!/bin/bash

SafeSedEscape () {
	echo $(printf '%s\n' "$1" | sed -e 's/[\/&]/\\&/g')
}

ReplaceWithEnv () {
	envName=$1
	echo $envName
	value=${!envName}
	echo $value
	escapedValue=$(SafeSedEscape $value)
	echo $escapedValue
	if [[ -n "${value}" ]]; then
		sed -i -r "s/^($envName=).*/\1$escapedValue/" $2
	fi
}

cp ./.env.example ./.env

envFileValues=(COINGGECKO_URL KEYBASE_URL PUSH_NOTIFICATION_SERVER_URL BITSONG_RPC BITSONG_EXPLORER BITSONG_MINTSCAN)
for i in "${envFileValues[@]}"
do
	ReplaceWithEnv $i ./.env
done
