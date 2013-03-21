## Node Setup ##

### Node Configuration ###

[Feature Incomplete]

### Node Installation ###

1.  Install git & openssl

    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev`
    Fedora:        `yum install git openssl-libs openssl-devel`
    SUSE:          `zipper in git openssl libopenssl-devel`

2.  Clone WebVirt repo to local install folder

    `git clone git://github.com/diogogmt/virt-node.git`

3.  Ensure all necessary dependancies are installed.  (See *Prerequisites* section for more details)

4.  Run the *WebVirt-Node* Installation script, installing additional dependancies as advised.

    **NOTE:** Installing as root is NOT required. If installing as root, root permissions will be required to make modifications

    `./webvirt-node-install.sh`

5.  Run `node_start.sh` to start the *WebVirt-Node*