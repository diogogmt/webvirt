/* ************************************************************ *
 * ** Webvirsh Quickstart Guide ******************************* *
 * ************************************************************ */

 Prerequisites: 
 -----------------

  - Running Fedora or Ubuntu distro
  - Active internet connection


 Preinstall:
 -----------------

 1) Clone the github repository:
 
      git clone git://github.com/diogogmt/virt-node.git

 2) Install Openssl & the Openssl-dev packages:

      Debian/Ubuntu: 
          apt-get install -y openssl libssl-dev

      Fedora:
          yum install openssl-libs openssl-devel


 Install:
 -----------------

 Two scripts are provided to automate the installation of the Webvirt application.

      [Webvirt-Manager]: 
          webvirt-manager-install.sh

      [Webvirt-Node]:
          webvirt-node-install.sh


 The script will check for critical dependancies before executing, and then display the 
 ones that are missing.  If this occurs, ensure all dependancies are installed and then
 try again.


 Deployment:
 -----------------

 To start the server, run the corresponding script:

      [Manager]: 
          server_start.sh

      [Node]:
          client_start.sh


 Important info: 
 -----------------

 By default, the installation process creates a web server listening on a port:

      [Manager]: 
          3000

      [Node]:
          4000

 As soon as the [Webvirt-Manager] is running, it can be reached via any modern browser
 through the host IP & port combination. 

   e.g. 
     To access the dashboard from the host machine, open a browser window
     and type: "127.0.0.1:3000" to start.
