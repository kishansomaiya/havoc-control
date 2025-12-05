#!/bin/sh
set -eu

if ( set -o pipefail 2>/dev/null ); then
  set -o pipefail
else
  echo "Warning: pipefail option is not supported on this system."
fi

command -v "docker" >/dev/null 2>&1 || (printf "Please install Docker: https://www.docker.com\n"; exit 1)

SCHEMA_DIR=${1:-"$(pwd)"}
ARTIFACTS_DIR=${2:-"$(pwd)"}

SCHEMA_DIR_ABS="$(cd "${SCHEMA_DIR}"; pwd)"

mkdir -p "${ARTIFACTS_DIR}"
ARTIFACTS_DIR_ABS="$(cd "${ARTIFACTS_DIR}"; pwd)"

docker run --rm \
    -v "${SCHEMA_DIR_ABS}:/schema" \
    -v "${ARTIFACTS_DIR_ABS}:/artifacts" \
    openapitools/openapi-generator-cli:v7.7.0 generate \
    -i /schema/adminservice_openapi.yaml \
    -g typescript-fetch \
    -o /artifacts \
    --additional-properties=disallowAdditionalPropertiesIfNotPresent=false,enumPropertyNaming=camelCase,enumUnknownDefaultCase=true,legacyDiscriminatorBehavior=false

find "${ARTIFACTS_DIR_ABS}" -type f -exec sed -i '' 's|/\* eslint-disable \*/|/* eslint-disable */ // @ts-nocheck|g' {} +
find "${ARTIFACTS_DIR_ABS}" -type f -exec sed -i '' "s|new Date(json\['created_at'])|isNaN(json['created_at']) ? (new Date(json['created_at'])) : (new Date(1000 * json['created_at']))|g" {} +
find "${ARTIFACTS_DIR_ABS}" -type f -exec sed -i '' "s|new Date(json\['updated_at'])|isNaN(json['updated_at']) ? (new Date(json['updated_at'])) : (new Date(1000 * json['updated_at']))|g" {} +
find "${ARTIFACTS_DIR_ABS}" -type f -exec sed -i '' "s|CreatedAtFromJSON(json\['created_at'])|isNaN(json['created_at']) ? (new Date(json['created_at'])) : (new Date(1000 * json['created_at']))|g" {} +
find "${ARTIFACTS_DIR_ABS}" -type f -exec sed -i '' "s|UpdatedAtFromJSON(json\['updated_at'])|isNaN(json['updated_at']) ? (new Date(json['updated_at'])) : (new Date(1000 * json['updated_at']))|g" {} +
