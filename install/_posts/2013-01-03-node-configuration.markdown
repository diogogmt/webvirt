---
rawtitle: node
---
## Node Setup ##

### Node Configuration ###

\[Feature Incomplete\]

### Node Installation ###

#### Overview ####

The *WebVirt Node* is a daemon that sits on a host running Libvirt.  This allows it to query Libvirt directly for instance information before sending it back to the *WebVirt Manager* in JSON format.  Installation should be quick and painless - be sure to follow the instructions carefully. 
The steps below are comprehensive, though they only list system-packages that the installation script is not configured to check for.  All other necessary system-packages will be checked at install time, at which point you will be prompted to install the ones that are missing.

For a complete list of all package-dependancies, check the *Prerequisites* page.

#### Install Steps ####

1.  Install git & openssl

    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev`

    Fedora:        `yum install git openssl-libs openssl-devel`
    
    SUSE:          `zipper in git openssl libopenssl-devel`

    **NOTE**: All installation steps should be completed as a normal user.  Only use root permissions when installing the system package prerequisites listed here, or as indicated by the install script.

2.  Clone WebVirt repo to local install folder

    `git clone git://github.com/diogogmt/virt-node.git`

3.  Navigate to cloned directory and checkout to the latest stable branch (currently **0.1**)
    
    `cd virt-node` 
    
    `git checkout 0.1`

4.  Run the *WebVirt-Node* Installation script, installing additional dependancies as advised

    `./webvirt-node-install.sh`

5.  Run `./node_start.sh` to start the *WebVirt-Node*









--------------------------------------------


    git
    openssl-libs
    openssl-devel
    make
    gcc-c++
    wget

Debian/Ubuntu

    git
    openssl
    libssl-dev
    make
    g++
    wget

OpenSUSE

    git
    openssl
    libopenssl-devel
    make
    gcc-c++
    wget
