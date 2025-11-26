#!/bin/bash

set -o errexit
# set -x

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." &>/dev/null && pwd -P)"
cd "${REPO_ROOT}"

SCRIPTS="hack/scripts"

PROTO_SRC="${REPO_ROOT}/tmp/messages/v0"
PROTO_OUT="${REPO_ROOT}/src/types/messages/v0"

CONTAINER_REGISTRY=${CONTAINER_REGISTRY:-"ghcr.io/havocai"}

IMAGE_TAG=${IMAGE_TAG:-$(git symbolic-ref -q --short HEAD || git describe --tags --exact-match)}
IMAGE=${IMAGE:-"${CONTAINER_REGISTRY}/frontend:${IMAGE_TAG}"}
PUSH=${PUSH:-false}
USE_BUILDAH=${USE_BUILDAH:-false}