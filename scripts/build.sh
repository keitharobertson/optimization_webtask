#!/bin/bash

docker build -t 'node_dev' .
docker run -t -i --rm -v `pwd`:/app -w /app node_dev npm install