#!/bin/bash

CURRENT_DIR=$(pwd)

NODE_JS_VERSION="v0.10.0"
NODE_JS_FILENAME="node-${NODE_JS_VERSION}-linux-x64.tar.gz"
NODE_JS_URL="http://nodejs.org/dist/${NODE_JS_VERSION}/${NODE_JS_FILENAME}"

REDIS_VERSION=2.6.11
REDIS_FILENAME="redis-${REDIS_VERSION}.tar.gz"

VIRT_MANAGER_DIR="virt-manager"

echo "NODE_JS_VERSION " $NODE_JS_VERSION
echo "NODE_JS_FILENAME " $NODE_JS_FILENAME
echo "NODE_JS_URL " $NODE_JS_URL
echo "CURRENT_DIR " $CURRENT_DIR
echo -e "\n---------\n"

#echo "Installing node dependencies."
#apt-get install python g++ make

echo -e "\n---------\n"

echo "Switching directories."
mkdir -p nodejs && cd $_

echo -e "\n---------\n"

pwd

echo -e "\n---------\n"

echo "Download last nodejs stable version."
wget -N $NODE_JS_URL

echo -e "\n---------\n"

echo "Untar node."
tar xzvf $NODE_JS_FILENAME

echo -e "\n---------\n"

echo "Switch directories."
cd `ls -rd node-v*/`

echo -e "\n---------\n"

export NODE="$(pwd)/bin/"
export NODE_PATH="$(pwd)/lib/"
echo "NODE: $NODE"
echo "NODE_PATH: $NODE_PATH"
echo "PATH: $PATH"
export PATH=$PATH:$NODE_PATH:$NODE
echo "PATH: $PATH"


echo "CURRENT_DIR " $CURRENT_DIR

cd $CURRENT_DIR

echo -e "\n---------\n"

pwd

echo -e "\n---------\n"




echo "Begin installing redis."

echo "Switching directories."
mkdir -p redis && cd $_

echo -e "\n---------\n"

echo "Downloading redis."

wget -N http://redis.googlecode.com/files/$REDIS_FILENAME

echo -e "\n---------\n"

echo "Untar redis."

tar xzf $REDIS_FILENAME

echo -e "\n---------\n"

echo "Switching dirs."

cd `ls -rd redis-**/`

echo -e "\n---------\n"

echo "Building redis."

make -j12 > /dev/null

echo -e "\n---------\n"

pwd

echo -e "\n---------\n"

echo "Cloning virt-manager repo"

cd $CURRENT_DIR

if [ ! -d "$VIRT_MANAGER_DIR" ]; then
  git clone https://github.com/diogogmt/virt-node.git $VIRT_MANAGER_DIR
fi

cd $VIRT_MANAGER_DIR

echo "Installing npm dependencies."
npm install

echo -e "\n---------\n"

cd $CURRENT_DIR

pwd

echo -e "\n---------\n"

