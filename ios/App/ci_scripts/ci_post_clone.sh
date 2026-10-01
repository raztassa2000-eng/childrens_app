#!/bin/sh
# Xcode Cloud: the iOS app embeds the web build and resolves Swift packages from
# node_modules, so install Node, build the web app and sync it into ios/ first.
set -e
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
brew install node

cd "$CI_PRIMARY_REPOSITORY_PATH"
npm ci
# Set VITE_API_BASE as an Xcode Cloud environment variable to point the app at your server.
npm run build
npx cap sync ios
