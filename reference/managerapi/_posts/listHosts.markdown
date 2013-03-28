---
rawtitle: List Hosts
---

## ListHosts ##

### Purpose ###

This call uses a list of all *WebVirt Node* IPs stored in the *WebVirt* database to aggregate vital host data dynamically.  This information is then returned in the form of a JSON object, detailed below.

This call was desiged for use in *WebVirt*'s web-interface primarily.

### Usage ###

`/list/models/hosts`

### Return ###

The call returns a JSON object with two attributes:

`hosts` - An array of `host` objects, each representing a host machine
`err` - A string, or an array of `error` objects (if present)

Each `host` JSON object contains:

`load` - Current host load, computed from the **uptime** Linux command
`hypervisor` - Host hypervisor software in use, as reported by **Libvirt**
`memUsed` - Total memory (in GB) currently in use by the host system
`memFree` - Total memory (in GB) free for use by the host system
`ip` - IP address of the host system

Each `error` JSON object contains:

`ip` - IP of the node in question
`err` - String containing the specific error message

### Snippets ###

**Example 1**: No hosts found in *WebVirt* database

		{
		  "err": 'No hosts found!'
		}

**Example 2**: One host found in *WebVirt* database, no errors

		{
		  "hosts": [
		    {
		      "load": "0.05",
		      "hypervisor": "QEMU 0.9.13",
		      "memUsed": "1.66",
		      "memFree": "13.88",
		      "ip": "10.0.0.4"
		    }
		  ],
		  "err": []
		}

**Example 3**: Multiple hosts in *WebVirt* database, no errors

		{
		  "hosts": [
		    {
		      "load": "1.23",
		      "hypervisor": "QEMU 0.9.13",
		      "memUsed": "0.25",
		      "memFree": "7.34",
		      "ip": "10.0.0.4"
		    },
				{
		      "load": "0.4",
		      "hypervisor": "QEMU 0.9.13",
		      "memUsed": "1.66",
		      "memFree": "13.88",
		      "ip": "10.0.0.26"
		    },
				{
		      "load": "0.05",
		      "hypervisor": "QEMU 0.9.13",
		      "memUsed": "12.50",
		      "memFree": "2.25",
		      "ip": "10.0.0.33"
		    },
		  ],
		  "err": []
		}

**Example 4**: Multiple hosts found in *WebVirt* database, multiple errors
		{
		  "hosts": [
		    {
		      "load": "1.23",
		      "hypervisor": "QEMU 0.9.13",
		      "memUsed": "0.25",
		      "memFree": "7.34",
		      "ip": "10.0.0.4"
		    },
		  ],
		  "err": [
		  	{
		  		"ip": "10.0.0.26"
		  		"err": "Error: EHOSTUNREACH"
		  	},
		  	{
		  		"ip": "10.0.0.33"
		  		"err": "Error: ECONNREFUSED"
		  	}
		  ]
		}