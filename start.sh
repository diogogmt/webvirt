#!/bin/bash

# Save the absolute path of the project's root
MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$MY_PATH" ] ; then
  exit 1 
fi

export NODE="nodejs/node-v0.8.10-linux-x64/bin"
export NODE_PATH="nodejs/node-v0.08.10-linux-x64/lib"
export PATH=$NODE_PATH:$NODE:$PATH
export NODE_PATH=$MY_PATH


# Need to automate prod an dev envs

# Production env
node_modules/forever/bin/forever start server.js
# Dev env
#node_modules/nodemon/nodemon.js server.js
