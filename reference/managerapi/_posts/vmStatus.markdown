---
rawtitle: VM Status
---

## vmStatus ##

### Purpose ###

This call queries a specific node, and a specific instance on that node for its current status.  This information is then returned as a JSON object.

### Usage ###

`/status/:ip/:name`

		Example 1: /status/10.0.0.4/demo1
		Example 2: /status/10.0.0.25/Fedora-1

**NOTE:** The name of the instance corresponds with the ID (not VID) reported by the listVms command.

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
