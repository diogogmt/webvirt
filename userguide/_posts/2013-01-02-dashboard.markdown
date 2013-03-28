---
rawtitle: dashboardSection
---

## Dashboard ##

The *Dashboard* provides the majority of the application's functionality.  From here, users can see every *WebVirt Node* they are managing, and explore and interact with instances running on those nodes.  

### Host information ###

The *Dashboard* will display a record for each *WebVirt Node* in its database.  This provides some key pieces of information:

1. Hypervisor type (as reported by *Libvirt*)
2. Load average (as reported by the `uptime` Linux command)
3. Ram used 
4. Ram free

### Viewing Instances ###

To view instances running on a *WebVirt Node*, click the **Green Gear** on the Node record you are interested in.


### Instance Actions ###

It is possible to perform a limited range of actions on instances directly from the *WebVirt Manager*'s web interface.  They are:

**Start**
		Boot up (but not resume) an instance

**Shutdown**
		Initiate a system shutdown on the instance. Because this action allows for the virtual operating system to follow its own shutdown procedure, the effect is not immediate.

**Force Shutdown**
		Initiate a forced shutdown, equivelent to "Pulling the plug" on a physical machine.

**Suspend**
		Pause an instance, in effect saving its state to a snapshot on the host machine.

**Resume**
		Resume a paused instance.