/* ************************************** * 
 * * VirshNode Manager Web Application ** *
 * **************************************  */
$(function() {

  // Global API Helper Object
  var API = {
    // AJAX wrapper
    callServer:  function(call, success, error) {
      $.ajax({
        url: "/" + call,
        datatype: "json",
        cache: false,
        success: success,
        error: function(textStatus) {
          // INTERFACE-SERVER ERROR HANDLING
          switch (textStatus) {
            case "null":
            case "timeout":
            case "error":
            case "abort":
            case "parsererror":
            default:
              console.log("XX On: " + this.url + " XX");
              console.log("XX Error, connection to interface-server refused XX");
              error();  
              break;
          } // END-Switch
        } // END-Error
      }); // End ajax call
    }, // END callServer function
  } 

  var Host = Backbone.Model.extend({
    initialize: function() {
      // Set IP, if not already set
      if (!this.get("ip")) {
        this.set("ip", 0);
      }

      // Bind an event to log changes to console
      this.on("change", function() {
        console.log("---Model: Updated!");
        console.log("   IP: " + this.get("ip"));
        console.log("   Hypervisor: " + this.get("hypervisor"));
      }, this);
      
      // Set other host data members
      this.updateHost();

      // Collect instances
      this.updateInstanceList();

    }, // END Initialize Method

    updateHost: function() {
      var that = this;

      // Call "version"
      API.callServer("version/" + that.get("ip"), 
        function(data, textStatus, jqXHR) {
          // Checks for VIRSH + Daemon Errors, exit on true
          if (data.err) { that.errHandle(data.err); return; }  

          that.set("hypervisor", data.data.hypervisor);
        },
        function() {
          console.log("XX version command errorz XX");
        });

      // Call "cpuStats"
      // API.callServer("list/daemonDetails/" + that.get("ip"), 
      //   function(data, textStatus, jqXHR) {
      //     // Checks for VIRSH + Daemon Errors
      //     if (data.err) { that.errHandle(data.err); return; }  

      //     // Set data
      //     that.set("cpuIdle", data.cpuStats.idle);
      //     that.set("cpuUsed", data.cpuStats.usage);
      //   },
      //   function() {
      //     console.log("XX cpu command errorz XX");
      //   });

      // // Call "memStats"
      // API.callServer("list/daemonDetails/" + that.get("ip"), 
      //   function(data, textStatus, jqXHR) {
      //     // Checks for VIRSH + Daemon Errors
      //     if (data.err) { that.errHandle(data.err); return; }  

      //     // Set data
      //     that.set("ramFree", data.memStats.free);
      //     that.set("ramUsed", (data.memStats.total) - (data.memStats.free)); 
      //   },
      //   function() {
      //     console.log("XX mem command errorz XX");
      //   });
    }, // END updateHost Method

    updateInstanceList: function() {
      var that = this;

      API.callServer("list/vms/" + that.get("ip"),
        function(data, textStatus, jqXHR) {
          // Check for virsh error, exit on true
          if (data.err) { that.errHandle(data.err); return; }  

          // Retrieve host-model keys prefixed with "vm-"
          var curAttributes = _.keys(that.toJSON());
          var curInstances = [];
          var newInstances = [];
          var i;

          for (i in curAttributes) {
            if (i.match(/^vm-[a-zA-Z0-9-]+$/)) curInstances.push(i);
          }

          // Loop, setting model attributes for each instance + adding to new instance list
          for (i in data.data) {
            that.set("vm-" + i.name, {id: i.id, status: i.status});
            console.log("Bah: ", i);
            newInstances.push("vm-"+i.name);
          }

          // Loop, unsetting instance attributes that no longer exist
          curInstances = _.difference(curInstances, newInstances);

          for (i in curInstances) {
            that.unset(i, "silent"); // SILENT COULD CAUSE PROBLEMS?? **********************
          }

        },
        function() {
          console.log("instance list errorz");
        });
    }, // END updateInstanceList Method

    updateInstance: function(vmName) {
      var that = this;

      API.callServer("status/" + that.get("ip") + "/" + vmName,
        function(data, textStatus, jqXHR) {
          // Check for virsh error, exit on true
          if (data.err) { that.errHandle(data.err); return; }  

          // Pull old record, update, and set
          var old = that.get("vm-"+vmName);
          old.status = data.stdout;
          that.set("vm-"+vmName, old);
        },
        function() {
          console.log("instance UPDATE errorz");
        });
    }, 

    getInstanceKeys: function() {
      // Retrieve keys prefixed with "vm-"
      var curAttributes = _.keys(this.toJSON());
      var curInstances = [];
      var i;

      for (i in curAttributes) {
        if (i.match(/^vm-[a-zA-Z0-9-]+$/)) curInstances.push(i);
      }

      return curInstances;
    }
  }); // END Model: Host

  var HostList = Backbone.Collection.extend({
    model: Host,
    
    localStorage: new Backbone.LocalStorage("hosts-backbone"),

    url: "/hosts",

    initialize: function() {
      // Set to fire a console log for each model
      this.on("add", function(model) {
        console.log(model);
        var vms = model.getInstanceKeys();
        var msg = "New Host!\nIP:" + model.get("ip");
        var i;

        _.each(vms, function(element, index, list) {
          msg += "\nVm #" + (index+1) + ": " + element;
        });

        console.log(msg);
      });

      var that = this;
      console.log("-begin collection calls");

      API.callServer("list/daemons/",
        function(data, textStatus, jqXHR) {
          // Loop through host list, creating a model for each
          _.each(data.data, function(element, index, list) {
            console.log("--Add Model | ip: " + element);
            that.add({ip: element});
          });
        },
        function() {
          console.log("XX Cannot find daemon-hosts! XX");
        });
    } // End Initialize
  }); // END Collection: HostList

  // Create global collection of Hosts
  console.log("[creating hosts]");
  var Hosts = new HostList();


  // var TestView = Backbone.View.extend({
  //   tagName: "p",

  //   template: _.template($('#testTemplate').html()),

  //   events: {
  //     "click a.refresh"   : "refresh",
  //     "click a.alert"     : "displayInfo"
  //   },

  //   initialize: function() {
  //     this.listenTo(this.model, 'change', this.render);
  //     this.listenTo(this.model, 'destroy', this.remove);
  //   },

  //   render: function() {
  //     this.$el.html(this.template(this.model.toJSON()));
  //     return this;
  //   },

  //   refresh: function() {
  //     Hosts.
  //   }
  // })


  // var HostRecordView = Backbone.View.extend({
  //   tagName: "div",

  //   template: _.template($('#host-record-template').html()),

  //   },

  // }); // END View: HostView

}) // END Application
