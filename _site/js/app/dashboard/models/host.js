
var app = app || {};

app.Host = Backbone.Model.extend({
  initialize: function() {
    // Set IP, if not already set
    if (!this.get("ip")) {
      this.set("ip", 0);
    }

    // Bind an event to log changes to console
    this.on("change", function() {
      console.log("------Model: Updated!");
      console.log("      IP: "          + this.get("ip"));
      console.log("      Hypervisor: "  + this.get("hypervisor"));
      console.log("      Cpu idle: "    + this.get("cpuIdle"));
      console.log("      Cpu used: "    + this.get("cpuUsed"));
      console.log("      Memory free: " + this.get("memFree"));
      console.log("      Memory used: " + this.get("memUsed"));
    }, this);
    
    // Check if data was passed
    if(!this.get("hypervisor")) {
      toastr.error("Daemon-host list is out of date, or the connection to the daemon has been lost: " + this.get("ip"));
    };
  }, // END Initialize Method

  updateHost: function() {
    var that = this;

    if (this.get("ip")) {
      // Call "version"
      app.API.callServer("stats/version/" + that.get("ip"), 
        function(data, textStatus, jqXHR) {
          // Checks for VIRSH + Daemon Errors, exit on true
          if (data.err) { that.errHandle(data.err); return; }  

          that.set("hypervisor", data.hypervisor);

          // Call "cpuStats"
          API.callServer("stats/cpu/" + that.get("ip"), 
            function(data, textStatus, jqXHR) {
              // Checks for VIRSH + Daemon Errors
              if (data.err) { that.errHandle(data.err); return; }  

              // Set data
              that.set("cpuIdle", data.idle);
              that.set("cpuUsed", data.usage);

              // Call "memStats"
              API.callServer("stats/mem/" + that.get("ip"), 
                function(data, textStatus, jqXHR) {
                  // Checks for VIRSH + Daemon Errors
                  if (data.err) { that.errHandle(data.err); return; }  

                  // Set data
                  that.set("memFree", data.free);
                  that.set("memUsed", (data.total) - (data.free)); 

                  // Trigger completion of model initialization
                  console.log("-----Model details retrieved: " + that.get("ip"));
                  that.trigger("complete:hostDetails"); // !!![TRIGGER]!!!
                },
                function() {
                  console.log("XX mem command errorz XX");
                });
            },
            function() {
              console.log("XX cpu command errorz XX");
            });          
        },
        function() {
          console.log("XX version command errorz XX");
        }
      );
    } // END-IF
  }, // END updateHost Method

  errHandle: function(err) {
    console.log("XX Error connecting to daemon: " + err + " XX");
    toastr.error("Daemon-host list is out of date, or the connection to the daemon has been lost: " + err);
  }
});
