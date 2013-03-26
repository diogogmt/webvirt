---
rawtitle: manager
---
## Manager Setup ##

### Manager Configuration ###

\[Feature Incomplete\]

### Manager Installation ###

#### Overview ####

The *WebVirt Manager* is a combination of a web-server and data aggregator that sends and receives information to/from *WebVirt Nodes*.  Through the web-based UI, actions can be performed on virtual instances hosted on a machine running the *WebVirt Node*.  Installation should be quick and painless - be sure to follow the instructions carefully.


The steps below are comprehensive, though they only list system-packages that the installation script is not configured to check for.  All other necessary system-packages will be checked at install time, at which point you will be prompted to install the ones that are missing.

For a complete list of all package-dependancies, check the *Prerequisites* page.

#### Install Steps ####


1.  Install prequisite system packages

    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev make g++ wget`

    Fedora:        `yum install git openssl-libs openssl-devel make gcc-c++ wget`
    
    SUSE:          `zipper in git openssl libopenssl-devel make gcc-c++ wget`

    **NOTE**: All installation steps should be completed as a normal user.  Only use root permissions when installing the system package prerequisites listed here, or as indicated by the install script.
    
2.  Clone WebVirt repo to local install folder

    `git clone git://github.com/diogogmt/virt-node.git`

3.  Navigate to cloned directory and checkout to the latest stable branch (currently **0.1**)
    
    `cd virt-node` 
    
    `git checkout 0.1`

4.  Run the *WebVirt-Manager* Installation script.

    `./webvirt-manager-install.sh`

5.  Run `./manager_start.sh` to start the *WebVirt-Manager*