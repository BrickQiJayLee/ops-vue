#!/bin/bash

# clear last build
[[ `docker ps -a | grep -w ops_vue | wc -l` -ne 0 ]] && docker rm -f ops_vue

# if clean last build, open it
[[ `docker images | grep -w ops_vue | wc -l` -ne 0 ]] && docker rmi ops_vue

export OPS_RUN_MODE=DEPLOY

npm install --registry=https://registry.npm.taobao.org

npm run build

docker build . -t ops_vue

docker run -d --network ops_web --name ops_vue -p 8082:8000 ops_vue