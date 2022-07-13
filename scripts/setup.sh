#!/bin/bash
echo "current dir: $PWD"
rm -r "$PWD/node_modules"
rm -r "$PWD/yarn.lock"
yarn
sed -i '/android {/a compileOptions {\n sourceCompatibility JavaVersion.VERSION_1_8 \n targetCompatibility JavaVersion.VERSION_1_8 \n }' "$PWD/node_modules/react-native-keychain/android/build.gradle"
npx rn-nodeify --install --hack
find ${PWD}/node_modules/*/ -name "build.gradle" -type f | xargs sed -i 's/\bcompile\b/implementation/g'
jetify