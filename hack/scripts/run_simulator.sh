#!/bin/bash

#!/usr/bin/env bash
set -e

SIM_PATH="${HAVOCOS_PATH:-../havocos/simulator/}"

CLEAN=0
if [[ "$1" == "-c" || "$1" == "--clean" ]]; then
  CLEAN=1
else
  echo "WARNING: The simulator state is NOT being reset between starts and stops."
  echo "It is recommended that you run with the clean flag (-c or --clean) or use the clean_sim command."
  read -p "Are you sure you want to continue? [y/N]: " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 1
  fi
fi

# Clean up simulator once local client is stopped
cleanup() {
  echo "Cleaning up, please dont kill until done..."
  if [[ $CLEAN -eq 1 ]]; then
    docker compose --project-directory "$SIM_PATH" down --volumes
  else
    docker compose --project-directory "$SIM_PATH" stop
  fi
}
trap cleanup EXIT ERR

# Start the simulator
if [[ $CLEAN -eq 1 ]]; then
  # Only call down if containers exist
  if docker compose --project-directory "$SIM_PATH" ps -a -q | grep -q '[0-9a-f]'; then
    docker compose --project-directory "$SIM_PATH" down --volumes
  fi
  docker compose --project-directory "$SIM_PATH" up --pull always --detach
else
  # Check if containers exist
  if ! docker compose --project-directory "$SIM_PATH" ps -a -q | grep -q '[0-9a-f]'; then
    echo "Simulator containers not found, creating them..."
    docker compose --project-directory "$SIM_PATH" up --detach
  fi
  docker compose --project-directory "$SIM_PATH" start
fi

echo "Use ctrl+c once to stop simulator properly."
vite --host 0.0.0.0 --port 5173
