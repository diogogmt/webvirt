/* ************************************** * 
 * * VirshNode Manager Web Application ** *
 * **************************************  */
$(function() {

///////////////////////////////////////////////
//////// GLOBALS //////////////////////////////
  
  // API Helper Object
  var API = {
    //// AJAX wrapper cb signatures:
    // [ success(data, textStatus, jqXHR) ]
    // [ error(jqXHR, textStatus, errorThrown) ]
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
      this.on("change", function() {
        console.log("------Model: Updated!");
        console.log("      IP: " + this.get("ip"));
        console.log("      Hypervisor: " + this.get("hypervisor"));
        console.log("      Cpu idle: " + this.get("cpuIdle"));
        console.log("      Cpu used: " + this.get("cpuUsed"));
        console.log("      Memory free: " + this.get("memFree"));
        console.log("      Memory used: " + this.get("memUsed"));
      }, this);
      
      // Check if data was passed
      if(!this.get("hypervisor")) this.updateHost();
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
  });

  var HostList = Backbone.Collection.extend({
    model: Host,
    
    url: "/list/models/hosts",

    totalHosts: 0,

    initialize: function() {
      this.refresh(function() {
        console.log("Host collection created");
      },
      function() {
        console.log("Host collection failed to create!");
      });
    }, // End Initialize

    comparator: function(model) {
      return model.get("ip");
    },

    refresh: function(success) {
      // Clear collection
      this.fetch(success, function() {
        console.log("ERROR REFRESHING HOST COLLECTION!");
      });
    }
  });

  var Instance = Backbone.Model.extend({
    initialize: function () {
    },

    sendCommand: function () {

    },

    urlRoot: function () {
      return ('/status/' + this.get("ip") + "/");
    },

    parse: function (res) {
      var copy;

      if (res.data) {
        copy = this.toJSON();
        copy.status = res.data;
      } 
      else if (res.err) {
        toastr.error(res.err, "Instance model");
      } 
      else
        copy = res;   

      return copy;
    }
    
  });

  var InstanceList = Backbone.Collection.extend({
    model: Instance,

    url: "/list/vms/",

    initialize: function() {
    },

    comparator: function(model) {
      return model.get("id");
    },

    parse: function(res) {
      return res.instances;
    }
  })

  var User = Backbone.Model.extend({
    initialize: function() {
      if (!this.get("username")) this.set("username", "username");
    }
  });

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
  });

  var InstanceRecordView = Backbone.View.extend({
    initialize: function () {
      console.log("-----InstanceRecord Initialization");
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', function () {
        console.log("-------Instance Model: Change detected!");
        this.render();
      });
    },

    events: {
      "click .refresh" : "refreshRecord",
      "click .start"   : "startInstance",
      "click .shutdown": "shutdownInstance",
      "click .resume"  : "resumeInstance",
      "click .suspend" : "suspendInstance",
      "click .destroy" : "destroyInstance"
    },

    template: _.template($('#instance-record-template').html()),

    render: function () {
      console.log("------Rendering instance view!");
      console.log("      DEBUG:");
      console.log(this.model.toJSON());

      this.$el.html( this.template(this.model.toJSON()) );

      console.log("      ...rendered!");

      return this;
    },

    refreshRecord: function(){
      console.log("REFRESHHHHHHHIIIIIINNNGG!")
      this.model.fetch();
    },

    startInstance: function(){
      var self = this;
      API.callServer("start/" + self.model.get("ip") + "/" + self.model.get("id"),
        function (data, textStatus, jqXHR) {
          if (data.err) {
            console.log("daemon error:" + data.err); 
            toastr.error("VIRSH: " + data.err);

            return;
          }

          toastr.success("VIRSH: " + data.data);

          console.log( "Start Instance:" + self.model.get("id") );
          console.log(data);
          console.log( "    VIRSH:" + data.data);
          self.refreshRecord();
        },
        function () {
          toastr.error("Error communicating with interface-server");
          console.log( "XX Error communicating with interface-server! XX");
        });
    },

    shutdownInstance: function(){
      var self = this;
      API.callServer("shutdown/" + self.model.get("ip") + "/" + self.model.get("id"),
        function (data, textStatus, jqXHR) {
          if (data.err) {
            console.log("daemon error:" + data.err); 
            toastr.error("VIRSH: " + data.err);

            return;
          }

          toastr.success("VIRSH: " + data.data);

          console.log( "Shutdown Instance:" + self.model.get("id") );
          console.log(data);
          console.log( "    VIRSH:" + data.data);

          // Update model
          self.model.fetch();
        },
        function () {
          toastr.error("Error communicating with interface-server");
          console.log( "XX Error communicating with interface-server! XX");
        });
    },

    resumeInstance: function(){
      var self = this;
      API.callServer("resume/" + self.model.get("ip") + "/" + self.model.get("id"),
        function (data, textStatus, jqXHR) {
          if (data.err) {
            console.log("daemon error:" + data.err); 
            toastr.error("VIRSH: " + data.err);

            return;
          }

          toastr.success("VIRSH: " + data.data);

          console.log( "Shutdown Instance:" + self.model.get("id") );
          console.log(data);
          console.log( "    VIRSH:" + data.data);

          // Update model
          self.model.fetch();
        },
        function () {
          toastr.error("Error communicating with interface-server");
          console.log( "XX Error communicating with interface-server! XX");
        });
    },

    suspendInstance: function(){
      var self = this;
      API.callServer("suspend/" + self.model.get("ip") + "/" + self.model.get("id"),
        function (data, textStatus, jqXHR) {
          if (data.err) {
            console.log("daemon error:" + data.err); 
            toastr.error("VIRSH: " + data.err);

            return;
          }

          toastr.success("VIRSH: " + data.data);

          console.log( "Shutdown Instance:" + self.model.get("id") );
          console.log(data);
          console.log( "    VIRSH:" + data.data);

          // Update model
          self.model.fetch();
        },
        function () {
          toastr.error("Error communicating with interface-server");
          console.log( "XX Error communicating with interface-server! XX");
        });
    },

    destroyInstance: function(){
      var self = this;
      API.callServer("destroy/" + self.model.get("ip") + "/" + self.model.get("id"),
        function (data, textStatus, jqXHR) {
          if (data.err) {
            console.log("daemon error:" + data.err); 
            toastr.error("VIRSH: " + data.err);

            return;
          }

          toastr.success("VIRSH: " + data.data);

          console.log( "Shutdown Instance:" + self.model.get("id") );
          console.log(data);
          console.log( "    VIRSH:" + data.data);

          // Update model
          self.model.fetch();
        },
        function () {
          toastr.error("Error communicating with interface-server");
          console.log( "XX Error communicating with interface-server! XX");
        });
    },

  });

  var RecordView = Backbone.View.extend({
    /* Initialization */
    initialize: function (){
      console.log("-----RecordView Initializing");
    },


    /* Templates */
    template: _.template($('#host-record-template').html()),

    /* Render */
    render: function() {
      // Populate template template
      console.log("------Record rendering");
  
      var q = this.model.toJSON();

      q.expanded = false;
      q.lastActive = "N/A";
      q.active = true;

      this.$el.html( this.template(q) );
      console.log("      ...rendered!");
      return this;
    },

  });


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
  });

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
  });

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
  });

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

      // Set callback to wait for Hosts collection to finish API calls
      this.listenTo(Hosts, "reset", this.displayHosts);


      // Set callback to clear record area
      this.on("empty:records", function(){
        // Empty record area
        $("#record-area").empty();
      });

      // Set user
      this.setUser();

      // Create breadcrumb
      this.makeBreadcrumbs();

      // Set host-detail-view to default
      this.displayDetails();

      // Create pagination view
      this.paginate();

      // Navigate to the default route
      // Routes.navigate("dashboard");
    },

    reset: function() {
      // Trigger clearing of records
      this.trigger("empty:records");

      // Reset hosts
      Hosts.refresh(this.displayHosts);

      // Set user
      this.setUser();

      // Create breadcrumb
      this.makeBreadcrumbs();

      // Set host-detail-view to default
      this.displayDetails();

      // Create pagination view
      this.paginate();
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

      // Empty record area
      $("record-area").empty();
      // Display hosts
      Hosts.each(this.displayHost, this);
    },

    displayHost: function(host) {
      console.log("----Attempting render: collecting host model details | ip: " + host.get("ip"));

      var view = new RecordView({model: host, type: "host"});
      $("#record-area").append( view.render().el );

    },

    displayInstances: function(ip) {
      var self = this;
      var crumbs = {
        curPage: "Host: " + ip,
        routes: [
          {path: "#dashboard", sequence: "Dashboard"}
        ]
      };

      // Callback declarations
      var success = function (model, response, options) {
        Instances.each( 
          function(model) {
            view = new InstanceRecordView({model: model});
            self.$("#record-area").append( view.render().el );
            // model.on("change", function (model) {
            //   view.$el.html(view.render().el);
            // });
          }
        );
      };
      var error = function() {
          console.log("Fetch failed!");
      };   

      // Render breadcrumbs
      this.makeBreadcrumbs(crumbs);

      // Render the display area
      this.displayDetails(ip);

      // Trigger emptying of record area
      this.$("#record-area").empty();

      var Instances = new InstanceList();

      Instances.hostIp = ip;
      Instances.url += ip;

      Instances.fetch({"success": success, "error": error});
    }
  }); 

///////////////////////////////////////////////
//////// APP LOGIC ////////////////////////////

console.log("[creating app]");

var App = new AppView();
///////////////////////////////////////////////
//////// ROUTING //////////////////////////////

var Dashboard = Backbone.Router.extend({
  routes: {
    "host/:ip"   : "listInstances",
    "dashboard"  : "gotoDashboard"
  },

  initialize: function () {
    var that = this;

    this.on("route:gotoDashboard", function() {
      console.log("[Return to Dashboard]");

      App.reset();
    });

    // Set instance list trigger to route #host/ip
    this.on("route:listInstances", function(ip) {
      console.log("[Render Instances]");
      console.log("  ...IP: " + ip);
      that.navigate("host/" + ip);
      App.displayInstances(ip);
    });
  }
});

  var Routes = new Dashboard();

  Backbone.history.start();





}) // END Application
