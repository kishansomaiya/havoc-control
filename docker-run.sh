#!/bin/sh
docker run -it --rm -p "3000:3000" --env-file .env jupiter-csg-frontend:dev $@

