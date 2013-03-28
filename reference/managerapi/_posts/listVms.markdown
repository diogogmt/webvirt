---
rawtitle: List VMs
---

## ListVMs ##

### Purpose ###

This call makes the *WebVirt Manager* query a specific *WebVirt Node* about the state of its instances.  It then returns that information in a JSON object.


### Usage ###

`/list/vms/:ip`

		Example 1: /list/vms/10.0.0.3
		Example 2: /list/vms/192.168.33.33

### Return ###

If unsuccessful, the call returns a JSON object with one attribute:

`err` - A string containing an error message

If successful, the call returns a JSON object with two attributes:

`instances` - An array of `instance` JSON objects, each representing an instance hosted on the node
`ip` - The IP of the host machine

Each `instance` JSON object contains:

`vid` - Current soft ID, provided by Libvirt
`id` - The unique name of the instance, provided by Libvirt (which can be used as a UUID)
`status` - Current status of the instance, provided by Libvirt
`ip` - The IP of the host machine

### Snippets ###

**Example 1**: No instances found

		{
		  "err": 'No instances found!'
		}

**Example 2**: One instance found

		{
		  "instances": [
		    {
		    	"vid": "1",
		    	"id": "Demo-1",
		    	"status": "running",
		    	"ip": "10.0.0.4"
		    }
		  ],
		  "ip": "10.0.0.4"
		}

**Example 3**: Multiple instances found

		{
		  "instances": [
		    {
		    	"vid": "1",
		    	"id": "Demo-1",
		    	"status": "running",
		    	"ip": "10.0.0.4"
		    },
		    {
		    	"vid": "3",
		    	"id": "Demo-5",
		    	"status": "shut down",
		    	"ip": "10.0.0.4"
		    },
		  ],
		  "ip": "10.0.0.4"
		}
