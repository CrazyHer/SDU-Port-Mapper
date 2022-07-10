#!/bin/bash
service nginx start &&\
node /usr/share/backend/sdu-port-mapper-backend.js &
_EC_CLI=1 start.sh