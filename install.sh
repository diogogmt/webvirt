#!/bin/bash

PROJECT_ROOT=$(pwd)

NODE_JS_VERSION="v0.10.0"
NODE_JS_FILENAME="node-${NODE_JS_VERSION}-linux-x64.tar.gz"
NODE_JS_URL="http://nodejs.org/dist/${NODE_JS_VERSION}/${NODE_JS_FILENAME}"

VIRT_MANAGER_DIR="virt-manager"

INSTALL_LOG="install.log"

NODE_JS_DIR="nodejs"


function checkError() {
  if [ $1 -ne 0 ]; then
      echo "Something went wrong, check $INSTALL_LOG for more information."
      echo $2
      exit 1
  fi
}

echo "Checking for depencies $DEPENDENCIES ..."
deps
echo -e "All depencies are installed, moving on.\n"
# Clean install.log file
echo "" > $INSTALL_LOG 2>&1


#######################
# Node.js installation
######################
echo "Begin node.js installation."

echo "Creating nodejs dir..."
mkdir -p $NODE_JS_DIR >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR creating nodejs dir."
checkError $CMD_RESULT "$MSG"

cd $NODE_JS_DIR >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR entering nodejs dir."
checkError $CMD_RESULT "$MSG"

echo "Downloading node.js package..."
# wget -N $NODE_JS_URL 2>> $INSTALL_LOG
wget -N $NODE_JS_URL
#Check for errors
CMD_RESULT=$?
MSG="ERROR downloading node.js package"
checkError $CMD_RESULT "$MSG"

echo "Untarring node.js package..."
tar xzvf $NODE_JS_FILENAME >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR untarring node.js package"
checkError $CMD_RESULT "$MSG"

cd `ls -rd node-v*/` >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR entering node.js package dir"
checkError $CMD_RESULT "$MSG"

# Export NODE vars required later on to install the project dependencies through npm
export NODE="$(pwd)/bin/"
export NODE_PATH="$(pwd)/lib/"
export PATH=$PATH:$NODE_PATH:$NODE

cd $PROJECT_ROOT >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR going back to project's root dir"
checkError $CMD_RESULT "$MSG"




################################
# NPM Dependencies installation
################################
echo "Installing npm dependencies."
# sudo npm install > /dev/null 2>> $INSTALL_LOG
npm install
#Check for errors
CMD_RESULT=$?
MSG="ERROR installating npm dependencies"
checkError $CMD_RESULT "$MSG"

################################
# Installating git submodules
################################
echo "Installing git submodules."
git submodule init
#Check for errors
CMD_RESULT=$?
MSG="ERROR initializing git submodules"
checkError $CMD_RESULT "$MSG"

git submodule update
#Check for errors
CMD_RESULT=$?
MSG="ERROR updating git submodules"
checkError $CMD_RESULT "$MSG"

echo -e "\n-----------------------\n"
echo    "Installation completed!"
echo -e "\n-----------------------\n"

