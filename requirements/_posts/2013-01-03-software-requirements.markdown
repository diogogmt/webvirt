---
rawtitle: softwareprereq
---


## Software Prerequisites

### Node ###

The *WebVirt Node* requires Libvirt in order for carry out its API functions.  

Ensure the *WebVirt Node* is only installed on machines being used as VM hosts managed by Libvirt.

### Common ###

#### Operating Systems ####

Both the *WebVirt Manager* and the *WebVirt Nodes* are built for Linux-based operating systems.  The three distribution families that are explicitly supported are:

*    Red Hat/Fedora `Fedora Release 17, 18 Tested`
*    Debian/Ubuntu `Ubuntu Release 12.04.2 LTS Tested`
*    OpenSUSE `Testing in progress`

#### Prerequisites & Dependancies ####

A number of packages are required before installation can begin.  The names for each package will vary depending on your distribution. Find your distro below for a list of package names specific to your version of Linux. 


*    git
*    openssl
*    openssl dev headers
*    make
*    g++
*    wget
*    libvirt

    NOTE: See the *Config & Install* section for more detailed installation examples. 