---
rawtitle: manager
---
## Manager Setup ##

### Manager Configuration ###

\[Feature Incomplete\]

### Manager Installation ###

1.  Install git & openssl

    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev`

    Fedora:        `yum install git openssl-libs openssl-devel`
    
    SUSE:          `zipper in git openssl libopenssl-devel`

2.  Clone WebVirt repo to local install folder

    `git clone git://github.com/diogogmt/virt-node.git`

3.  Navigate to cloned directory and checkout to the latest stable branch (currently **0.1**)
    
    `cd virt-node` 
    
    `git checkout 0.1`

4.  Ensure all necessary dependancies are installed.  (See *Prerequisites* section for more details)

5.  Run the *WebVirt-Manager* Installation script, installing additional dependancies as advised.

    `./webvirt-manager-install.sh`

    **NOTE:** Installing as root is NOT required. If installing as root, root permissions will be required to make modifications

6.  Run `manager_start.sh` to start the *WebVirt-Manager*