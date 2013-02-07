# VirshNode-Manager API | First Draft #

## Interface-Server API ##

This RESTful API is used to send commands to the VirshNode-Manager's interface-server, which will process the command and make further RESTful API calls to each individual **VNM**-Daemon in order to access the libvirt CLI.  

---

### daemonList ###

**Description**:

> This call returns a list of host machines that have both **libvirt** and the **VNM-Daemon** installed.  Results are returned as an array of JSON objects, detailed below.

**Usage**: 

> `interface-server-ip:portNo/daemonList`

**Arguments**:

> `None`  

**Return Data**:

    {host1: X.X.X.X, host2: X.X.X.X, ...}

---

### vmList ###

**Description**:

> This call returns a list of all instances being managed by each machine hosting **libvirt** and the **VNM-Daemon**.  Results are returned as an array of JSON objects, detailed below.

**Usage**: 

> `interface-server-ip:portNo/vmList`

**Arguments**:

> `None`  

**Return Data**:

    {
            daemon-host-ip: 
            {
                1 :
                {
                    name: instanceName, id: instanceID, status: instanceStatus
                },
                2 : 
                {
                    name: instanceName, id: instanceID, status: instanceStatus
                },
                3 :
                {
                    name: instanceName, id: instanceID, status: instanceStatus
                },
            },
            ...       
        }
        
---

### status ###

**Description**:

> This call returns the status of a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  The status is returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/status/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:

> `{status: instanceStatus}`

**Example Use**:
> http://10.0.0.1:3434/status/10.0.2.233/instance-00000002

*returns*:

    {status: shut down}

---

### start ###

**Description**:

> This call runs the VIRSH START command on a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/status/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.0.1:3434/start/10.0.2.233/instance-00000002

*returns*:
    {
        stdout: "instance-00000002 is starting up.", 
        stderr: ""
    }

---

### resume ###

**Description**:

> This call runs the VIRSH RESUME command on a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/resume/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.0.1:3434/start/10.0.2.233/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is resuming.", 
        stderr: ""
    }

---

### suspend ###

**Description**:

> This call runs the VIRSH SUSPEND command on a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/suspend/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.0.1:3434/start/10.0.2.233/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is suspending.", 
        stderr: ""
    }

---

### shutdown ###

**Description**:

> This call runs the VIRSH SHUTDOWN command on a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/shutdown/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:
  
    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.0.1:3434/start/10.0.2.233/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is being shut down.", 
        stderr: ""
    }

---

### destroy ###

**Description**:

> This call runs the VIRSH DESTROY command on a specific instance on a specific host running both  **libvirt** and **VNM-Daemon**.  Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/resume/ip/name`

**Arguments**:

> ip - *IP address of the daemon-host managing the instance*
> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.0.1:3434/start/10.0.2.233/instance-00000002

*returns*:
 
    {
        stdout: "instance-00000002 is being destroyed.", 
        stderr: ""
    }

---

## VNM-Daemon API ##

This RESTful API is used to send commands directly to an instance of the **VNM-Daemon** API, which then runs the associated **libvirt** CLI command and returns the results as a JSON object.


### vmList ###

**Description**:

> This call returns a list of all instances being managed by the machine being queried.  Results are returned as an array of JSON objects, detailed below.

**Usage**: 

> `interface-server-ip:portNo/vmList`

**Arguments**:

> `None`  

**Return Data**:

    {
        daemon-host-ip: 
        {
            1 :
            {
                name: instanceName, id: instanceID, status: instanceStatus
            },
            2 : 
            {
                name: instanceName, id: instanceID, status: instanceStatus
            },
            3 :
            {
                name: instanceName, id: instanceID, status: instanceStatus
            },
        },
        ...       
    }
        
---

### status ###

**Description**:

> This call returns the status of a specific instance on the machine being queried.  The status is returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/status/name`

**Arguments**:

> name - *Unique identifier of the instance*  

**Return Data**:

    {status: instanceStatus}

**Example Use**:

> http://10.0.2.233:3434/status/instance-00000002

*returns*:

    {status: shut down}

---

### start ###

**Description**:

> This call runs the VIRSH START command for a specific instance on the machine being queried. Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/status/name`

**Arguments**:

> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.2.233:3434/start/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is starting up.", 
        stderr: ""
    }

---

### resume ###

**Description**:

> This call runs the VIRSH RESUME command for a specific instance on the machine being queried. Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/resume/name`

**Arguments**:
> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.2.233:3434/resume/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is resuming.", 
        stderr: ""
    }

---

### suspend ###

**Description**:

> This call runs the VIRSH SUSPEND command for a specific instance on the machine being queried. Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/suspend/name`

**Arguments**:

> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.2.233:3434/suspend/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is suspending.", 
        stderr: ""
    }

---

### shutdown ###

**Description**:

> This call runs the VIRSH SHUTDOWN command for a specific instance on the machine being queried. Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/shutdown/name`

**Arguments**:

> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.2.233:3434/shutdown/instance-00000002

*returns*:
  
    {
        stdout: "instance-00000002 is being shut down.", 
        stderr: ""
    }

---

### destroy ###

**Description**:

> This call runs the VIRSH DESTROY command for a specific instance on the machine being queried. Standard out and standard error are returned as a JSON object, detailed below.

**Usage**: 

> `interface-server-ip:portNo/resume/name`

**Arguments**:

> name - *Unique identifier of the instance*  

**Return Data**:

    {
        stdout: VIRSH output, 
        stderr: VIRSH error messages
    }

**Example Use**:

> http://10.0.2.233:3434/destroy/instance-00000002

*returns*:

    {
        stdout: "instance-00000002 is being destroyed.", 
        stderr: ""
    }
