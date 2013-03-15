#!/bin/bash

PROJECT_ROOT=$(pwd)

INSTALL_LOG="install.log"

# OS CHECK
MATCH=$(cat /proc/version | grep -c "Red Hat")
if [[ $MATCH == 1 ]]; then
  OS_TYPE="rh"
else
  OS_TYPE="ub"
fi


DEPENDENCIES="wget git"

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
    if
      do ! which $dep &>/dev/null;  then
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


echo "Checking for depencies $DEPENDENCIES ..."
deps

echo -e "All depencies are installed, moving on.\n"
# Clean install.log file
echo "" > $INSTALL_LOG 2>&1

./install.sh


