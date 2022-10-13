#!/bin/bash
echo "current dir: $PWD"
rm -r "$PWD/node_modules"
rm -r "$PWD/yarn.lock"
yarn
sed -i '/android {/a\
  compileOptions {\
    sourceCompatibility JavaVersion.VERSION_1_8 \
    targetCompatibility JavaVersion.VERSION_1_8 \
  }' "$PWD/node_modules/react-native-keychain/android/build.gradle"
npx rn-nodeify --install --hack
find ${PWD}/node_modules/*/ -name "build.gradle" -type f | xargs perl -pi -e 's/\bcompile\b/implementation/g;'