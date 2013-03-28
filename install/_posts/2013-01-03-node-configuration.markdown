--- 
rawtitle: node 
--- 
## Node Setup ## 
 
#### Overview #### 
 
The *WebVirt Node* is a daemon that sits on a host running Libvirt.  This allows it to query Libvirt directly for instance information before sending it back to the *WebVirt Manager* in JSON format.  Installation should be quick and painless - be sure to follow the instructions carefully.  
 
#### Install Steps #### 
 
1.  Install prerequisite system packages 
 
    Debian/Ubuntu: `apt-get install -y git openssl libssl-dev make g++ wget` 
 
    Fedora:        `yum install git openssl-libs openssl-devel make gcc-c++ wget` 
     
    SUSE:          `zipper in git openssl libopenssl-devel make gcc-c++ wget` 
 
    **NOTE**: All installation steps should be completed as a normal user.  Only use root permissions when installing the system package prerequisites listed here, or as indicated by the install script. 
 
2.  Clone WebVirt repo to local install folder 
 
    `git clone git://github.com/diogogmt/webvirt.git` 
 
3.  Navigate to cloned directory and checkout to the latest stable branch (currently **master**) 
     
    `cd webvirt`  
     
4.  Run the *WebVirt-Node* Installation script, installing additional dependencies as advised 
 
    `./webvirt-node-install.sh` 
 
5.  Run `./node_start.sh` to start the *WebVirt-Node*
 
#### Troubleshooting ####

If a *WebVirt Node* does not reply to an API call within three seconds, it is considered down.