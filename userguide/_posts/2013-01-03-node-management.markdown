## Node Management ##

WebVirt uses a lightweight *Node* daemon to act as an interface between the *Manager* and the instance of Libvirt running on the *Node*.  In order for the *Manager* to discover these *Nodes*, the IP addresses of each machine must be added to WebVirt's database.  Currently, WebVirt supports three methods of *Node* Management:

### Adding Hosts (Manual) ###

1.  From the Dashboard, use the side-bar navigation menu on the left side of the screen to select **Node Management**

2.  Use the management interface to manually type each host IP, clicking **Add** to notify the *Manager* that a new *Node* has been added.

### Adding Hosts (JSON) ###

A list of *Node* IPs can be uploaded to the manager in this JSON format:

    {



    }

To upload the file:

1.  From the Dashboard, use the side-bar navigation menu on the left side of the screen to select **Node Management**

2.  Use the management interface browse your filesystem and select the JSON-formatted file you wish to upload.

3.  Click **Upload List** to add all of the IPs into the *Manager* database simultaniously.

### Adding Hosts (Auto) | EXPERIMENTAL ###

If your network configuration & security support the use of the *NMAP* utility, you can use the WebVirt *Crawler* functionality to automatically discover and add the IPs of machines running the WebVirt *Node*.  This function will only discover *Nodes* on the subnet provided at install time.  For more details on install-time configuration, see the *configuration* section.  For technical details on the WebVirt *Crawler*,

### Common Issues ###