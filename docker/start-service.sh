#!/bin/bash
service nginx start &&\
nohup node /usr/share/backend/sduproxy-backend.js& ;