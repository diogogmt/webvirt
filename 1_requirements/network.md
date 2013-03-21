## Network Prerequisites ##

### Common ###

The WebVirt Application requires that all of its components have direct network routes to one another.  In order to take advantage of its advanced *Crawler* functionality, which will automatically detect *Webvirt Nodes* on the subnet provided at configuration time, the network must support the use of the NMAP utility.  This can be managed without the automatic *Crawler* functionality.  More details can be found in the developer documentation.

### WebVirt Node ###

The *WebVirt Node* requires a dedicated port on its host machine in order to function properly.  By default, this is set to **4000**, but can be manually configured by the system administrator before and after installation.

### WebVirt Manager ###

The *WebVirt Manager* requires a dedicated port on its host machine in order to function properly.  By default, this is set to **3000**, but can be manually configured by the system administrator before and after installation.