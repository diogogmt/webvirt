export NODE="nodejs/node-v0.8.10-linux-x64/bin"
export NODE_PATH="nodejs/node-v0.08.10-linux-x64/lib"
export PATH=$PATH:$NODE_PATH:$NODE
export NODE_PATH=$MY_PATH

node_modules/forever/bin/forever $@