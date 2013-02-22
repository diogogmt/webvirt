/* ************************************** * 
 * * VirshNode Manager Web Application ** *
 * **************************************  */
$(function() {

///////////////////////////////////////////////
//////// GLOBALS //////////////////////////////
  
  // API Helper Object
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

///////////////////////////////////////////////
//////// MODELS & COLLECTIONS /////////////////

  var Host = Backbone.Model.extend({
    initialize: function() {
      // Set IP, if not already set
      if (!this.get("ip")) {
        this.set("ip", 0);
      }

      // Bind an event to log changes to console
      this.on("complete", function() {
        console.log("------Model: Updated!");
        console.log("      IP: " + this.get("ip"));
        console.log("      Hypervisor: " + this.get("hypervisor"));
        console.log("      Cpu idle: " + this.get("cpuIdle"));
        console.log("      Cpu used: " + this.get("cpuUsed"));
        console.log("      Memory free: " + this.get("memFree"));
        console.log("      Memory used: " + this.get("memUsed"));
      }, this);
      
      // Set other host data members
      this.updateHost();

      // Collect instances
      this.updateInstanceList();
    }, // END Initialize Method

    updateHost: function() {
      var that = this;

      // Call "version"
      API.callServer("stats/version/" + that.get("ip"), 
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
                  that.trigger("complete");
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
        });
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
          _.each(data.instances, function(el, index, list) {
            that.set("vm-" + el.name, {"id": el.id, "status": el.status, "ip": el.ip});
            console.log("Bah: ", el.name);
            newInstances.push("vm-"+el.name);
          });

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
    }, // END updateInstance Method

    getInstanceKeys: function() {
      // Retrieve keys prefixed with "vm-"
      var curAttributes = _.keys(this.toJSON());
      var curInstances = [];
      var i;

      _.each(curAttributes, function(el, list, index) {
        if (el.match(/^vm-[a-zA-Z0-9-]+/)) curInstances.push(el);
      });

      return curInstances;
    }, // END getInstanceKeys Method

    sendInstanceCommand: function(cmd, vmName) {
      var that = this;

      console.log(API.callServer(cmd + vmName, 
        function(data, textStatus, jqXHR) {
          // Check for virsh error, exit on true
          if (data.err) { return data.err; }  

          var instance = that.get("vm-" + vmName);

          console.log(instance);
          // Set data and fire event
          instance.status = data.data;
          that.set("vm-" + vmName, instance);

          that.trigger("complete:cmd" + vmName);
        }, // END success Case
        function() {
          console.log("interface-server connection error");
          return null; // Error handling?
        })); // End API callServer

    },

    errHandle: function(err) {
      console.log("XX Error connecting to daemon: " + err + " XX");
    }
  }); // END Model: Host

  var HostList = Backbone.Collection.extend({
    model: Host,
    
    localStorage: new Backbone.LocalStorage("hosts-backbone"),

    url: "/hosts",

    totalHosts: 0,

    initialize: function() {
      // Set to fire a console log for each model
      // this.on("add", function(model) {
      //   var vms = model.getInstanceKeys();
      //   var msg = "New Host!\nIP:" + model.get("ip");
      //   var i;

      //   _.each(vms, function(element, index, list) {
      //     msg += "\nVm #" + (index+1) + ": " + element;
      //   });

      //   console.log(msg);
      // });

      var that = this;
      console.log("-begin collection calls");

      API.callServer("list/daemons/",
        function(data, textStatus, jqXHR) {
          // Loop through host list, creating a model for each
          _.each(data.daemons, function(element, index, list) {
            console.log("--Add Model | ip: " + element);
            that.add({ip: element});
            // Increment host counter
            that.totalHosts = that.totalHosts + 1;
          });

          // Fire event marking all hosts added to the collection
          App.trigger("complete:hostList");
        },
        function() {
          console.log("XX Cannot find daemon-hosts! XX");
        });
    }, // End Initialize

    comparator: function(model) {
      return model.get("ip");
    }

  }); // END Collection: HostList

  var User = Backbone.Model.extend({
    initialize: function() {
      if (!this.get("username")) this.set("username", "username");
    }
  }); // END Model: Host

  // Create host collection
  console.log("[creating hosts]");
  var Hosts = new HostList();


///////////////////////////////////////////////
//////// VIEWS ////////////////////////////////

  /*  Content  */

  var HostDescriptionView = Backbone.View.extend({
    /* Initialization */

    // Bind Element to container div
    el: $("#description-area"),

    initialize: function (){

      // Set type
      this.options.type = (this.options.type === "undefined") ? "host" : this.options.type;

      console.log("----HostDescriptionView created.");
    },

    /* Templates */
    stdTemplate: _.template($('#host-record-template').html()),
    blankTemplate: _.template($('#host-blank-template').html()),

    /* Events */
    // events: {
    //   "DOMContentLoaded": render,

    // },

    /* Render */
    render: function() {
      if (this.options.type === "host") {
        console.log("    Model: ");
        console.log(this.model.toJSON());

        var q = this.model.toJSON();

        q.expanded = false;
        q.lastActive = "N/A";
        q.active = true;

        this.$el.append( this.stdTemplate(q) );
      }
      else {
        this.$el.html( this.blankTemplate() );
      
        console.log("-----Blank template rendered");

      }

      return this;
    }
  }); // END View: HostDescriptionView

  var RecordView = Backbone.View.extend({
    /* Initialization */
    el: $("#record-area"),

    initialize: function (){
      var that = this;

      // Check for type, 
      if (!this.options.type) { this.options.type = "host"; }

      // Bind model change event
      this.listenTo(this.model, "complete", function() {
        // Trigger event for record rendering
        console.log("------Attempting record render: !!!!");
        that.trigger("complete:hostDetails");
      });

      this.listenTo(this.model, "empty:records", function() {
        this.$el.empty();
      });
    },

    /* Templates */
    HostTemplate: _.template($('#host-record-template').html()),
    InstanceTemplate: _.template($('#instance-record-template').html()),

    /* Render */
    render: function() {
      // Populate template template
      console.log("----Record rendering");
      console.log("    to JSON:");

      if (this.options.type === "host"){
        console.log("    Model: ");
        console.log(this.model.toJSON());

        var q = this.model.toJSON();

        q.expanded = false;
        q.lastActive = "N/A";
        q.active = true;

        this.$el.append( this.HostTemplate(q) );
      }
      else {
        console.log("Dummy!");

        // Parse instance name
        var i = this.model.get(this.options.instance);
        i.name = this.options.instance.substr(3);

        // Send instance command
        this.model.sendInstanceCommand("status/" + i.ip + "/", i.name);

        this.listenTo(this.model, "complete:cmd" + i.name, function() {
          i.status = (this.model.get(this.options.instance)).status;
          console.log(i.status);
          this.$el.append( this.InstanceTemplate(i) );
        })

      }

      return this;
    }
  }); // END View: RecordView


  /*  Scaffolding  */

  var LogoutView = Backbone.View.extend({
    /* Initialization */

    // Bind to HTML elemenl
    el: $("#logout"),

    // model: User, <-- No model yet

    initialize: function (){
      // Bind model change event
      // this.listenTo(this.model, "change", this.render);
    },

    /* Templates */
    template: _.template($('#logout-template').html()),
    

    /* Events */
    // events: {
    //   "DOMContentLoaded": render,

    // },

    /* Render */

    render: function() {
      // User generator logic here
      var data = {username: "Username"};
      // Populate logout template
      console.log("-----Logout rendering");

      this.$el.html( this.template(data) );

      return this;
    }
  }); // END View: LogoutView

  var BreadcrumbsView = Backbone.View.extend({
    /* Initialization */
    el: $("#breadcrumbs"),

    initialize: function (){
        if (typeof(this.options.path.curPage) === "undefined") {
        this.options.path = {
          curPage: "Dashboard",
          routes: [] // {path: , sequence: }]
        };
      } // END IF
    },

    /* Templates */
    template: _.template($('#breadcrumbs-template').html()),
    
    /* Events */
    // events: {
    //   "DOMContentLoaded": render,

    // },

    /* Render */
    render: function() {
      // Breadcrumb generator logic here


      // Populate breadcrumb template
      console.log("-----Breadcrumbs rendering");

      this.$el.html( this.template(this.options.path) );
    
    
      return this;
    }

  }); // END View: BreadcrumbsView

  var PaginationView = Backbone.View.extend({
    /* Initialization */
    el: $("#pagination"),

    initialize: function (){
      // Bind model change event
      // this.listenTo(this.model, "change", this.render);

      // Compute max pages
    },

    /* Templates */
    template: _.template($('#pagination-template').html()),
    
    /* Events */
    // events: {
    //   "DOMContentLoaded": render,

    // },

    render: function() {
      // Pagination generator logic here
      var data = {
        prev: false, 
        prevLink: "#",
        pageLinks: [
          {
            active: true,
            link: "#",
            order: 1
          }
        ],
        next: false,
        nextLink: "#"
      };
      // Populate pagination template
      console.log("-----Pagination rendering");

      this.$el.html( this.template(data) );

      return this;
    }
  }); // END View: PaginationView

  /*  Application  */

  var AppView = Backbone.View.extend({
    // Bind Element to container div
    el: $("#virshmanagerapp"),

    collection: Hosts,

    events: {
      // "DOMContentLoaded": render,
      // "click .hostRecord" : "" // ??
    },

    initialize: function() {
      console.log("--AppView instance created");

      // Set trigger to wait for Hosts collection to finish API calls
      this.on("complete:hostList", this.displayHosts, this);

      this.reset();

      // Navigate to the default route
      Routes.navigate("dashboard");
    },

    reset: function() {
      // Set user
      this.setUser();

      // Create breadcrumb
      this.makeBreadcrumbs();

      // Set host-detail-view to default
      this.displayDetails();

      // Create pagination view
      this.paginate();

      // Display host records
      this.displayHosts();
    },

    setUser: function() {
      // Create blank description view
      var logoutView = new LogoutView();

      console.log("---Attempting render: Logout");
      // blankDetail.render().el;
      // Render view
      logoutView.$el.empty();
      logoutView.render().el;
    },

    makeBreadcrumbs: function(data) {
      console.log("---Attempting render: Breadcrumbs");

      // Set data to safe state
      if (typeof(data) === "undefined" || typeof(data) !== "object") data = {};

      // Create breadcrumbs view
      var breadcrumbs = new BreadcrumbsView({path: data});

      // Render view
      breadcrumbs.$el.empty();
      breadcrumbs.render().el;
    },


    paginate: function() {
      // Create view
      var pagination = new PaginationView();  

      console.log("---Attempting render: Pagination");

      // Render pagination
      pagination.$el.empty();
      pagination.render().el;
    },

    displayDetails: function(ip) {

      if (typeof(ip) === "undefined") {
        // Create blank description view
        var blankDetail = new HostDescriptionView({type: "blank"});

        console.log("---Attempting render: Blank Details");
        // blankDetail.render().el;
        // Render view
        blankDetail.$el.empty();
        blankDetail.render().el;
      }
      else {
        // Create description view of passed IP
        var hostDetail = new HostDescriptionView({model: (Hosts.where({"ip": ip}))[0], type: "host"});
        hostDetail.$el.empty();
        hostDetail.render().el;
      }
    },


    displayHosts: function() {
      console.log("---DisplayHosts Check");
      Hosts.each(this.displayHost, this);
    },

    displayHost: function(host) {
      console.log("----Attempting render: collecting host model details | ip: " + host.get("ip"));

      // Create view
      var view = new RecordView({model: host, type: "host"});

      // Render view
      this.listenTo(App, "complete:gotoDashboard", function() {
        view.$el.empty();
      });

      this.listenTo(view, "complete:hostDetails", function() {
        view.$el.append(view.render());
      });

    },

    displayInstances: function(ip) {
      // Render breadcrumbs
      var data = {
        curPage: "Host: " + ip,
        routes: [
          {path: "#dashboard", sequence: "Dashboard"}
        ]
      };

      this.makeBreadcrumbs(data);

      // Render the display area
      this.displayDetails(ip);

      // Render the instance records
      var view;
      var model = (Hosts.where({"ip": ip}))[0];
      
      // Trigger emptying of record area
      model.trigger("empty:records");

      _.each(model.getInstanceKeys(), function(el, index, list) {
        console.log("RENDERING INSTANCE RECORD");
        view = new RecordView({model: model, type: "instance", instance: el});
        view.$el.append(view.render());
      });

    }
  }); // END View: AppView


///////////////////////////////////////////////
//////// ROUTING //////////////////////////////

var Dashboard = Backbone.Router.extend({
  routes: {
    "host/:ip"   : "listInstances",
    "dashboard"  : "gotoDashboard"
  },

  initialize: function () {
    var that = this;

    this.listenTo(Hosts, "complete:hostList", function() {
      that.navigate("dashboard");
      App.reset();
    }, Hosts);

    this.on("route:gotoDashboard", function() {
      console.log("[Return to Dashboard]");

      // Trigger "complete:gotoDashboard" event, clearing the record area
      App.trigger("complete:gotoDashboard");
      Hosts.trigger("complete:hostList");
    });

    // Set instance list trigger to route #host/ip
    this.on("route:listInstances", function(ip) {
      console.log("[Render Instances]");
      that.navigate("host/" + ip);
      App.displayInstances(ip);
    });
  }
});

var Routes = new Dashboard();

Backbone.history.start();
Routes.navigate("");



///////////////////////////////////////////////
//////// APP LOGIC ////////////////////////////

  console.log("[creating app]");

  var App = new AppView();

}) // END Application
