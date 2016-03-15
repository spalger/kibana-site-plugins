#!/usr/bin/env bash

set -e;

version="${1:-$npm_package_version}"

if [[ ! -n "$version" ]]; then
  echo "you need to use 'npm run build', or pass the version as the first arg to the build script."
  env
  exit 1
fi

workspace="build"
proj="site_plugins"
dir="$workspace/$proj"
archive="$proj-$version.zip"

# out with the old
rm -rf "$workspace";

# in with the new
mkdir -p "$dir";
cp -r public index.js site_plugins package.json "$dir";

# install prod deps
cd "$dir"
npm install --production
cd -

# make an archive
cd "$dir/.."
zip -r "$archive" "$proj"
cd -
