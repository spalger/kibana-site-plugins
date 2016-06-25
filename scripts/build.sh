#!/usr/bin/env bash

set -e;

if [ ! -f package.json ]; then
  echo "this script must be run from the root of the kibana-site-plugins repo"
  exit 1
fi

set -x;

root="$(pwd)"
proj="$(jq -r .name package.json)"
version="$(jq -r .version package.json)"
build="$root/build"
plugin="$build/kibana/$proj"
archiveName="$proj-$version.zip"

# out with the old
rm -rf "$build";

# in with the new
mkdir -p "$plugin";
cp -r public index.js site_plugins package.json "$plugin";

# install prod deps
cd "$plugin"
npm install --production

# zip it up
cd "$build"
zip -r "$archiveName" "kibana"
