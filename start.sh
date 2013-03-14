#!/bin/bash

MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$MY_PATH" ] ; then
  exit 1  # fail
fi
echo "$MY_PATH"
export NODE_PATH=$MY_PATH

REDIS_IP="127.0.0.1"
REDIS_PORT=6379
REDIS_DIR="redis/redis-2.6.11/src"

NODE="nodejs/node-v0.10.0-linux-x64/bin/node"

export NODE="nodejs/node-v0.10.0-linux-x64/bin"
export NODE_PATH="nodejs/node-v0.10.0-linux-x64/lib"

echo "PATH: $PATH"

export PATH=$PATH:$NODE_PATH:$NODE

echo "Starting redis-server"
echo "REDIS_DIR: $REDIS_DIR"
nohup $REDIS_DIR/redis-server --port $REDIS_PORT &

echo -e "\n---------------\n"

echo $PWD
cd $MY_PATH
pwd

node_modules/nodemon/nodemon.js server.js
