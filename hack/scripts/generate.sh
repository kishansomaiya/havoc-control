#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/setup.sh"

rm -rf "${PROTO_SRC}"
mkdir -p "${PROTO_OUT}" "${PROTO_SRC}"

buf export "https://github.com/HavocAI/messages.git#ref=v0,subdir=protobuf" --output "${PROTO_SRC}"

pbjs -t static-module -w es6 -o "${PROTO_OUT}/bundle.js" "${PROTO_SRC}/*.proto"
pbts -g "protobuf" -o "${PROTO_OUT}/bundle.d.ts" "${PROTO_OUT}/bundle.js"