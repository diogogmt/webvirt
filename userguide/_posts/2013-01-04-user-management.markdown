---
rawtitle: userSection
---

## User Management ##

Basic authentication is built-in to the *WebVirt Manager*, allowing for a single user to be created and authenticated before access to the *WebVirt Manager* is granted.  

**NOTE:** This authentication does not prevent someone from sending an API call to *WebVirt Nodes*.

Currently, WebVirt supports three methods of *WebVirt Node* Management:

### Creating a User ###

1.  From the browser, navigate to the "Create User" page:

		e.g. "http://localhost:3500/user/create"

2.  Follow the prompts to create a user

### Changing your Password ###
 
To change your password:

1.  Login as normal

2.  Navigate to the "Change Password" page:

		e.g. "http://localhost:3500/user/changePassword"

3.  Follow the prompts to change your password

### Changing your Password ###
 
To change your password:

1.  Login as normal

2.  Navigate to the "Change Password" page:

		e.g. "http://localhost:3500/user/changePassword"

3.  Follow the prompts to change your password

### Forgotten your Password? ###

To reset a password currently requires the following steps:

1.  In a terminal session, navigate to the *WebVirt* root directory.

2.  Run the remove user script:

		e.g. `./remove_users.sh`

3.  From the browser, navigate to the "Create User" page:

		e.g. "http://localhost:3500/user/create"

4.  Follow the prompts to create a new user
