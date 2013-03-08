MY_PATH="`dirname \"$0\"`"              # relative
MY_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$MY_PATH" ] ; then
  exit 1  # fail
fi
echo "$MY_PATH"
export NODE_PATH=$MY_PATH
nodemon server.js
