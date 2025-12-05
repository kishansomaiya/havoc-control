#!/bin/sh

env="$(jq --compact-output --null-input 'env | with_entries(select(.key | startswith("VITE_")))')"
env_escaped="$(printf "%s" "${env}" | sed -e 's/[\&/]/\\&/g')"
echo "var env=${env_escaped}" > /usr/share/nginx/html/envs.js
sed -i "s/<noscript id=\"env\"><\/noscript>/<script src=\"envs.js\"><\/script>/g" /usr/share/nginx/html/index.html

exec "$@"
