#!/bin/bash

PROJECT_ROOT=$(pwd)

# OS CHECK
MATCH=$(cat /proc/version | grep -c "Red Hat")
if [[ $MATCH == 1 ]]; then
  OS_TYPE="rh"
else
  OS_TYPE="ub"
fi

REDIS_VERSION=2.6.11
REDIS_FILENAME="redis-${REDIS_VERSION}.tar.gz"
REDIS_URL="http://redis.googlecode.com/files/$REDIS_FILENAME"

VIRT_MANAGER_DIR="virt-manager"

INSTALL_LOG="install.log"

REDIS_DIR="redis"

DEPENDENCIES_DEB="make gcc g++ wget git"
DEPENDENCIES_FED="make gcc gcc-c++ wget git"

function deps {
  deps_ok=YES
  if [[ $OS_TYPE == "ub" ]]; then
    for dep in $DEPENDENCIES_DEB
    do
      if ! which $dep &>/dev/null;  then
              echo -e "This script requires $dep to run but it is not installed"
              echo -e "If you are running Ubuntu or Debian, you might be able to install $dep with the following  command"
              echo -e "\t\tsudo apt-get install $dep\n"
              deps_ok=NO
      fi
    done
  else
    for dep in $DEPENDENCIES_FED
    do
      if ! which $dep &>/dev/null;  then
              echo -e "This script requires $dep to run but it is not installed"
              echo -e "If you are running Fedora, you might be able to install $dep with the following  command"
              echo -e "\t\tsudo yum install $dep\n"
              deps_ok=NO
      fi
    done
  fi

  if [[ "$deps_ok" == "NO" ]]; then
    echo -e "Unmet dependencies ^"
    echo -e "Aborting!"
    exit 1
  else
    return 0
  fi
}


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
# Redis installation
#######################
echo "Begin redis installation"

echo "Creating redis dir..."
mkdir -p $REDIS_DIR >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR creating redis dir."
checkError $CMD_RESULT "$MSG"

cd $REDIS_DIR >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR entering redis dir."
checkError $CMD_RESULT "$MSG"

echo "Downloading redis package..."
wget -N $REDIS_URL
#Check for errors
CMD_RESULT=$?
MSG="ERROR downloading redis package"
checkError $CMD_RESULT "$MSG"

echo "Untarring redis package..."
tar xzvf $REDIS_FILENAME >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR untarring redis package"
checkError $CMD_RESULT "$MSG"

cd `ls -rd redis-**/` >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR entering redis package dir"
checkError $CMD_RESULT "$MSG"

echo "Building redis..."
make -j12 > /dev/null 2>> $INSTALL_LOG
#Check for errors
CMD_RESULT=$?
MSG="ERROR building redis"
checkError $CMD_RESULT "$MSG"

cd $PROJECT_ROOT >> $INSTALL_LOG 2>&1
#Check for errors
CMD_RESULT=$?
MSG="ERROR going back to project's root dir"
checkError $CMD_RESULT "$MSG"


./install.sh


