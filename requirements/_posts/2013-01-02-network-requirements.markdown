---
rawtitle: networkprereq

---

## Network Prerequisites ##

### Common ###

The WebVirt Application requires that all of its components have direct network routes to one another.  In order to take advantage of its advanced *Crawler* functionality, which will automatically detect *Webvirt Nodes* on the subnet provided at configuration time, the network must support the use of the NMAP utility.  This can be managed without the automatic *Crawler* functionality.  More details can be found in the developer documentation.

### WebVirt Node ###

The *WebVirt Node* requires:

*  One port open, default `4000` \*

### WebVirt Manager ###

*  One port open, default `3500` \*

    \* Ports can be manually configured by the system administrator before and after installation.  