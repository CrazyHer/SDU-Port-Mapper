#!/bin/bash
service nginx start &&\
node /usr/share/backend/sduproxy-backend.js &
start.sh