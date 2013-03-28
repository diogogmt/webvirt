export NODE_TYPE="server"
export NODE_PORT=3500

REDIS_DIR="redis/redis-2.6.11/src"
REDIS_CONF="config/redis.conf"

# Check if redis-server is already running
netstat -atnp 2>/dev/null | grep -qE ".*${REDIS_PORT}.*"redis-server
if [ $? -ne 0 ]; then
  echo "Starting redis server"
  $REDIS_DIR/redis-server $REDIS_CONF
fi

./start.sh
