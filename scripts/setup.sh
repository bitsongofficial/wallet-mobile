#!/bin/bash
echo "current dir: $PWD"
rm -r "$PWD/node_modules"
rm -r "$PWD/yarn.lock"
yarn
rn-nodeify --install --hack
jetify