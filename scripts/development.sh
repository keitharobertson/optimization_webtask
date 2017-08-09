#!/bin/bash

CONTAINER_NAME=node_dev

docker stop -t0 ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}

docker run -d -p 3000:3000 --name ${CONTAINER_NAME} -e "NODE_ENV=development" -v `pwd`:/app node_local_dev node_modules/nodemon/bin/nodemon.js --legacy-watch --exec npm run babel-node -- index.js
