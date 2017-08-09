#!/bin/bash

docker run -t -i --rm -v `pwd`:/app -w /app node_dev npm install --save-dev "$@"
docker build -t 'node_dev' .
