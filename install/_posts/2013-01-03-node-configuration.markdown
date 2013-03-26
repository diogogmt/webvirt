---
rawtitle: node
---
## Node Setup ##

### Node Configuration ###

\[Feature Incomplete\]

### Node Installation ###

#### Overview ####

The *WebVirt Node* is a daemon that sits on a host running Libvirt.  This allows it to query Libvirt directly for instance information before sending it back to the *WebVirt Manager* in JSON format.  Installation should be quick and painless - be sure to follow the instructions carefully. 

    **NOTE**: All installation steps should be completed as a normal user.  Only use root permissions when installing additional system package prerequisites as indicated by the install script.

The steps below are comprehensive, though they only list system-packages that the installation script is not configured to check for.  All other necessary system-packages will be checked at install time, at which point you will be prompted to install the ones that are missing.

For a complete list of all package-dependancies, check the *Prerequisites* page.

#### Install Steps ####

1.  Install git & openssl

    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev`

    Fedora:        `yum install git openssl-libs openssl-devel`
    
    SUSE:          `zipper in git openssl libopenssl-devel`

2.  Clone WebVirt repo to local install folder

    `git clone git://github.com/diogogmt/virt-node.git`

3.  Navigate to cloned directory and checkout to the latest stable branch (currently **0.1**)
    
    `cd virt-node` 
    
    `git checkout 0.1`

4.  Run the *WebVirt-Node* Installation script, installing additional dependancies as advised.

    `./webvirt-node-install.sh`

    **NOTE:** Installing as root is NOT required. If installing as root, root permissions will be required to make modifications

5.  Run `./node_start.sh` to start the *WebVirt-Node*