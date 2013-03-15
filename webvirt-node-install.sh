#!/bin/bash

PROJECT_ROOT=$(pwd)

INSTALL_LOG="install.log"


DEPENDENCIES="wget git"

function deps {
  deps_ok=YES
  for dep in $DEPENDENCIES
  do
    if ! which $dep &>/dev/null;  then
            echo -e "This script requires $dep to run but it is not installed"
            echo -e "If you are running ubuntu or debian you might be able to install $dep with the following  command"
            echo -e "\t\tsudo apt-get install $dep\n"
            deps_ok=NO
    fi
  done
  if [[ "$deps_ok" == "NO" ]]; then
    echo -e "Unmet dependencies ^"
    echo -e "Aborting!"
    exit 1
  else
    return 0
  fi
}


echo "Checking for depencies $DEPENDENCIES ..."
deps

echo -e "All depencies are installed, moving on.\n"
# Clean install.log file
echo "" > $INSTALL_LOG 2>&1

./install.sh


