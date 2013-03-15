#!/bin/bash

# Save the absolute path of the project's root
MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$MY_PATH" ] ; then
  exit 1 
fi

REDIS_DIR="redis/redis-2.6.11/src"
REDIS_CONF="config/redis.conf"

export NODE="nodejs/node-v0.10.0-linux-x64/bin"
export NODE_PATH="nodejs/node-v0.10.0-linux-x64/lib"
export PATH=$PATH:$NODE_PATH:$NODE
export NODE_PATH=$MY_PATH

# Check if redis-server is already running
netstat -atnp 2>/dev/null | grep -qE ".*${REDIS_PORT}.*"redis-server
if [ $? -ne 0 ]; then
  echo "Starting redis server"
  $REDIS_DIR/redis-server $REDIS_CONF
fi

node_modules/nodemon/nodemon.js server.js
