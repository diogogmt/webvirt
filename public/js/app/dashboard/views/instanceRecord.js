
var app = app || {};

app.InstanceRecordView = Backbone.View.extend({
  initialize: function () {
    console.log("-----InstanceRecord Initialization");

    if (!this.options.empty) {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', function () {
        console.log("-------Instance Model: Change detected!");
        this.render();
      });
    }

    this.template = this.options.empty ? _.template($('#instance-empty-template').html()) : _.template($('#instance-record-template').html())
  },

  events: {
    "click .refresh" : "refreshRecord",
    "click .start"   : "startInstance",
    "click .shutdown": "shutdownInstance",
    "click .resume"  : "resumeInstance",
    "click .suspend" : "suspendInstance",
    "click .destroy" : "destroyInstance"
  },

  render: function () {
    console.log("------Rendering instance view!");

    this.$el.html( this.template(this.model && this.model.toJSON() || null) );

    console.log("      ...rendered!");

    return this;
  },

  refreshRecord: function(){
    toastr.success("Instance status refreshed");
    this.model.fetch();
  },

  startInstance: function(){
    var self = this;
    app.API.callServer("start/" + self.model.get("ip") + "/" + self.model.get("id"),
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
      function (jqXHR, err, ex) {
        toastr.error("Error communicating with interface-server! ERR: " + jqXHR.responseText);
      });
  },

  shutdownInstance: function(){
    var self = this;
    app.API.callServer("shutdown/" + self.model.get("ip") + "/" + self.model.get("id"),
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
      function (jqXHR, err, ex) {
        toastr.error("Error communicating with interface-server! ERR: " + jqXHR.responseText);
      });
  },

  resumeInstance: function(){
    var self = this;
    app.API.callServer("resume/" + self.model.get("ip") + "/" + self.model.get("id"),
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
      function (jqXHR, err, ex) {
        toastr.error("Error communicating with interface-server! ERR: "  + jqXHR.responseText);
      });
  },

  suspendInstance: function(){
    var self = this;
    app.API.callServer("suspend/" + self.model.get("ip") + "/" + self.model.get("id"),
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
      function (jqXHR, err, ex) {
        toastr.error("Error communicating with interface-server! ERR: "  + jqXHR.responseText);
      });
  },

  destroyInstance: function(){
    var self = this;
    app.API.callServer("destroy/" + self.model.get("ip") + "/" + self.model.get("id"),
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
      function (jqXHR, err, ex) {
        toastr.error("Error communicating with interface-server! ERR: " + jqXHR.responseText);
      });
  },

});
