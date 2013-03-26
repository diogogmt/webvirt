#!/bin/bash

export NODE="nodejs/node-v0.10.0-linux-x64/bin"
export NODE_PATH="nodejs/node-v0.10.0-linux-x64/lib"
export PATH=$PATH:$NODE_PATH:$NODE
export NODE_PATH=$MY_PATH

node utils/remove-users.js

