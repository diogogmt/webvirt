Before installing Virt-Manager make sure you have the following dependencies resolved.

Ubuntu:

apt-get install wget git gcc g++ make libssl-dev




By default the redis-server runs on port 6379.
To modify the port number as well other configuration options edit the file conf/redis.conf

If the redis-server is using a port number different than 6379 specify as an argument to the server_start.sh and client_start.sh