---
rawtitle: nodeSection
---

## Node Management ##

WebVirt uses a lightweight daemon called the *WebVirt Node* to act as an interface between the *WebVirt Manager* and the instance of Libvirt running on each host.  In order for the *WebVirt Manager* to discover these *WebVirt Nodes*, the IP addresses of each machine must be added to WebVirt's database.  

Currently, WebVirt supports three methods of *WebVirt Node* Management:

### Adding Hosts (Manual) ###

1.  From the Dashboard, use the side-bar navigation menu on the left side of the screen to select **Node Manager**

2.  Use the management interface to manually type each host IP, clicking **Add Node** to notify the *WebVirt Manager* that a new *WebVirt Node* has been added.

### Adding Hosts (JSON) ###

A plaintext list of *WebVirt Node* IPs can be uploaded to the manager, but must be in this JSON format:

		{
		  "hosts": [
		    "X.X.X.X",
		    "X.X.X.X"
		  ]
		}

To upload the file:

1.  From the Dashboard, use the side-bar navigation menu on the left side of the screen to select **Node Management**

2.  Under **Upload list of hosts**, browse your filesystem and select the JSON-formatted plaintext file you wish to upload.

3.  Click **Upload File** to add all of the IPs into the *WebVirt Manager* database simultaniously. 

