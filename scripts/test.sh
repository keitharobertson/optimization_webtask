#!/bin/bash

docker run -t -i --rm -e "NODE_ENV=development" -v `pwd`:/app node_dev npm test "$@"
