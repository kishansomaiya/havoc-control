#!/bin/bash

source "$(dirname "${BASH_SOURCE[0]}")/setup.sh"

if ${PUSH}; then
    ARGS="${ARGS} --push"
fi

docker buildx build . --tag "${IMAGE}" --load ${ARGS}
