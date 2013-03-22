
var app = app || {};
var ENTER_KEY = 13;

  app.Controller = Backbone.View.extend({
    // Bind Element to container div
    el: $("#virshmanagerapp"),

    collection: app.Hosts,

    initialize: function() {
      console.log("--AppView instance created");

      // Set callback to clear record area
      this.on("empty:records", function(){
        // Empty record area
        $("#content-area").empty();
      });

      toastr.options.timeOut = 10000;
      toastr.options.fadeOut = 1000;
      toastr.options.tapToDismiss = true;

      console.log(toastr);
    },

    reset: function(cb) {
      var self = this;

      // Set callback to wait for Hosts collection to finish API calls
      this.listenTo(app.Hosts, "reset", function() {
        console.log("---DisplayHosts Check");

        // Empty record area
        $("#content-area").empty();

        // Display hosts
        app.Hosts.each(this.displayHost, this);

        // Prevent host record duplication
        self.stopListening(app.Hosts, "reset");
      });

      // Trigger clearing of records
      this.trigger("empty:records");

      // Display loading image
      var loading = new app.LoadingView();
      loading.render();

      // Set nav
      this.setNav("dashboard");

      // Reset hosts
      app.Hosts.refresh();

      // Set user
      this.setUser();

      // Create breadcrumb
      this.makeBreadcrumbs();

      // Set host-detail-view to default
      this.displayDetails();

      // Run callback
      if (cb) {
        cb();
      }
    },

    setUser: function() {
      // Create blank description view
      console.log(app.LogoutView);
      var logoutView = new app.LogoutView();

      console.log("---Attempting render: Logout");
      // blankDetail.render().el;
      // Render view
      logoutView.$el.empty();
      logoutView.render().el;
    },

    setNav: function(curPage) {
      var navView = new app.NavView({active: curPage});

      console.log("---Attempting render: Navigation");

      navView.render().el;
    },

    makeBreadcrumbs: function(data) {
      console.log("---Attempting render: Breadcrumbs");

      // Set data to safe state
      if (typeof(data) === "undefined" || typeof(data) !== "object") data = {};

      // Create breadcrumbs view
      var breadcrumbs = new app.BreadcrumbsView({path: data});

      // Render view
      breadcrumbs.$el.empty();
      breadcrumbs.render().el;
    },

    paginate: function() {
      // Create view
      var pagination = new app.PaginationView();  

      console.log("---Attempting render: Pagination");

      // Render pagination
      pagination.$el.empty();
      pagination.render().el;
    },

    displayDetails: function(data) {
      data = data || {};

      if (typeof(data.ip) === "undefined") {
        if (typeof(data.title) === "undefined") {
          // Create blank description view
          var blankDetail = new app.HostDescriptionView({type: "blank"});

          console.log("---Attempting render: Blank Details");
          // blankDetail.render().el;
          // Render view
          blankDetail.$el.empty();
          blankDetail.render().el;
        }
        else {
          // Create title
          var titleDetail = new app.HostDescriptionView({title: data.title});

          console.log("---Attempting render: Title area");

          titleDetail.$el.empty();
          titleDetail.render().el;

        } 
      } // END If
      else {
        // Create description view of passed IP
        var hostDetail = new app.HostDescriptionView({model: (app.Hosts.where({"ip": data.ip}))[0], type: "host"});
        hostDetail.$el.empty();
        hostDetail.render().el;
      } // END Else
    },

    displayHost: function(host) {
      console.log("----Attempting render: collecting host model details | ip: " + host.get("ip"));
      console.log(host.toJSON());

      if (host.get("ip") && host.get("hypervisor")) {
        var view = new app.RecordView({model: host, type: "host"});
        $("#content-area").append( view.render().el );
      }
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
        // Trigger emptying of record area
        self.$("#content-area").empty();

        console.log("INSTANCES LENGTHHHHHH ::: " + Instances.length);
        if (Instances.length) {
          Instances.each( 
            function(model) {
              view = new app.InstanceRecordView({model: model});
              self.$("#content-area").append( view.render().el );
              // model.on("change", function (model) {
              //   view.$el.html(view.render().el);
              // });
            }
          );
        }
        else {
          view = new app.InstanceRecordView({empty: true});
          self.$("#content-area").append( view.render().el );
        }

      };
      var error = function() {
          console.log("Fetch failed!");
      };   

      // Render breadcrumbs
      this.makeBreadcrumbs(crumbs);

      // Render the display area
      this.displayDetails({"ip": ip});

      // Loading image
      var loading = new app.LoadingView();
      loading.render();

      var Instances = new app.InstanceList();

      Instances.hostIp = ip;
      Instances.url += ip;

      Instances.fetch({"success": success, "error": error});
    },

    displayManage: function() {
      // Prevent hosts populating the content area
      this.stopListening(app.Hosts, "reset");

      var self = this;
      var crumbs = {
        curPage: "Node Management",
        routes: [
          {path: "#dashboard", sequence: "Dashboard"}
        ]
      };

      // Render breadcrumbs
      this.makeBreadcrumbs(crumbs);

      // Render nav
      this.setNav("daemon");

      // Render the display area
      this.$("#description-area").empty();

      // Trigger emptying of record area
      this.$("#content-area").empty();
      
       var daemonWrapper = new app.WrapperView();
    },

    loadStart: function() {
      $('#content-area').empty();

      var loader = new LoadView();
      loader.render().el;

      loader.listenTo(this, "load:stop", function() {
        $('#content-area').empty();      
        loader.remove();
      });
    },

    displayLogs: function() {
      // Prevent hosts populating the content area
      this.stopListening(app.Hosts, "reset");

      var self = this;
 
      var crumbs = {
        curPage: "Server Logs",
        routes: [
          {path: "#dashboard", sequence: "Dashboard"}
        ]
      };

      // Render breadcrumbs
      this.makeBreadcrumbs(crumbs);

      // Render nav
      this.setNav("logs");

      // Render the display area
      this.$("#description-area").empty();

      // Trigger emptying of record area
      this.$("#content-area").empty();
      
      var logWrapper = new app.LogController();
    }
  }); 
