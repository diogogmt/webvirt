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
        console.log("---Model: Updated!");
        console.log("   IP: " + this.get("ip"));
        console.log("   Hypervisor: " + this.get("hypervisor"));
        console.log("   Cpu idle: " + this.get("cpuIdle"));
        console.log("   Cpu used: " + this.get("cpuUsed"));
        console.log("   Memory free: " + this.get("memFree"));
        console.log("   Memory used: " + this.get("memUsed"));
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
          console.log("dummy check, hypervisor set to: " + that.get("hypervisor"));

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
                  that.trigger("complete");
                  App.trigger("complete");
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
      this.on("add", function(model) {
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
          _.each(data.daemons, function(element, index, list) {
            console.log("--Add Model | ip: " + element);
            that.add({ip: element});
            // Increment host counter
            that.totalHosts = that.totalHosts + 1;
          });

        },
        function() {
          console.log("XX Cannot find daemon-hosts! XX");
        });
    }, // End Initialize

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

      // Bind model change event
      if (this.options.type !== "blank") { this.listenTo(this.model, "change", this.render); }

      console.log("HostDescriptionView created.");
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
      if (this.options.type !== "blank") {
         
      }
      else {
        this.$el.html( this.blankTemplate() );
      
        console.log("Blank template rendered");

      }

      return this;
    }
  }); // END View: HostDescriptionView

  var RecordView = Backbone.View.extend({
    /* Initialization */
    el: $("#record-area"),

    initialize: function (){
      // Check for type, 
      if (!this.options.type) { this.options.type = "host"; }

      // Bind model change event
      // this.listenTo(this.model, "complete", this.render);
    },

    /* Templates */
    HostTemplate: _.template($('#host-record-template').html()),
    InstanceTemplate: _.template($('#instance-record-template').html()),

    /* Render */
    render: function() {
      // Populate template template
      console.log("Record rendering");
      console.log("to JSON:");

      if (this.options.type === "host"){
        console.log("Model: ");
        console.log(this.model.toJSON());

        var q = this.model.toJSON();

        q.expanded = false;
        q.lastActive = "N/A";
        q.active = true;
        console.log("Appended: ");


        this.$el.html( this.HostTemplate(q) );
      }
      else {
        console.log(this.model.toJSON());

        this.$el.html( this.model.toJSON() );
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
      console.log("Logout rendering");

      this.$el.html( this.template(data) );

      return this;
    }
  }); // END View: LogoutView

  var BreadcrumbsView = Backbone.View.extend({
    /* Initialization */
    el: $("#breadcrumbs"),

    initialize: function (){
      // Bind model change event
      // this.listenTo(this.model, "change", this.render);
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
      var data = {
        curPage: "Current Page",
        routes: [{path:"#", sequence: "Route 1"}, {path:"#", sequence: "Route 2"}, {path:"#", sequence: "Route 3"}]
      };

      // Populate breadcrumb template
      console.log("Breadcrumbs rendering");

      this.$el.html( this.template(data) );
    
    
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
      console.log("Pagination rendering");

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

      // Set user
      this.setUser();

      // Create breadcrumb
      this.makeBreadcrumbs();

      // Set host-detail-view to default
      this.clearDetails();

      // Create pagination view
      this.paginate();

      // Collect and display records
      this.on("complete", this.displayHosts);

      console.log("AppView instance created");
    },

    setUser: function() {
      // Create blank description view
      var logoutView = new LogoutView();

      console.log("Attempting render: Logout");
      // blankDetail.render().el;
      // Render view
      logoutView.$el.empty();
      logoutView.render().el;
    },

    makeBreadcrumbs: function() {
      console.log("Attempting render: Breadcrumbs");

      // Create breadcrumbs view
      var breadcrumbs = new BreadcrumbsView();

      // Render view
      breadcrumbs.$el.empty();
      breadcrumbs.render().el;
    },


    paginate: function() {
      // Create view
      var pagination = new PaginationView();  

      console.log("Attempting render: Pagination");

      // Render pagination
      pagination.$el.empty();
      pagination.render().el;
    },

    clearDetails: function() {
      // Create blank description view
      var blankDetail = new HostDescriptionView({type: "blank"});

      console.log("Attempting render: Blank Details");
      // blankDetail.render().el;
      // Render view
      blankDetail.$el.empty();
      blankDetail.render().el;
    },


    displayHosts: function() {
      console.log("ALERRTTTT!!!");
      Hosts.each(this.displayHost, this);
    },

    displayHost: function(host) {
      console.log("Attempting render: Host record");

      // Create view
      var view = new RecordView({model: host, type: "host"});

      // Render view
      view.$el.append(view.render().el);
    }
  }); // END View: AppView

///////////////////////////////////////////////
//////// APP LOGIC ////////////////////////////

  console.log("[creating app]");

  var App = new AppView({});

}) // END Application
