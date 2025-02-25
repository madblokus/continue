#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension
set -e

echo "Installing root-level dependencies..."
npm install

echo "Installing Core extension dependencies..."
pushd core
## This flag is set because we pull down Chromium at runtime
export PUPPETEER_SKIP_DOWNLOAD='true'
npm install
npm link
popd

# VSCode Extension (will also package GUI)
echo "Installing VSCode extension dependencies..."
pushd extensions/vscode
# This does way too many things inline but is the common denominator between many of the scripts
npm install
npm link @continuedev/core
popd

echo "Installing GUI extension dependencies..."
pushd gui
npm install
npm link @continuedev/core
npm run build
popd



echo "Installing binary dependencies..."
pushd binary
npm install
npm run build
popd

echo "Installing docs dependencies..."
pushd docs
npm install
<<<<<<< HEAD:scripts/install-and-build.sh
popd


# VSCode Extension (will also package GUI)
echo "Packaging extension..."
pushd extensions/vscode
npm run prepackage
npm run package

popd
=======

popd
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:scripts/install-dependencies.sh
