BBCloneMail.module("DashboardApp.Dashboard", function(Dashboard, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

  var VmInstance = Backbone.Model.extend({
    defaults: {
      id: '',
      status: '',
      ip: '',
    },

    initialize: function () {
      console.log("VmInstance - initialize");
    },

  });

  var VmInstanceCollection = Backbone.Collection.extend({
    model: VmInstance,

    initialize: function (options) {
      console.log("VmInstanceCollection - initialize");
      console.log("----options: ", options);
      options = options || {};
      this.ip = options.ip;
      this.url = "/list/vms/" + this.ip;
      console.log("this.url: ", this.url);
    },

    parse: function (response) {
      console.log("VmInstanceCollection - parse");
      console.log("----response: ", response);
      return response.instances;
    },
  });



  var Host = Backbone.Model.extend({
    defaults: {
      ip: '',
      hypervisor: '',
      load: '',
      memFree: '',
      memUsed: '',
      active: true,
      memCritical: false,
      loadCritical: false,
      expanded: false
    },

    idAttribute: "ip",

    initialize: function () {
      console.log("Host.Model - initialize");
    },

  });

  var HostCollection = Backbone.Collection.extend({
    model: Host,
    url: "/list/models/hosts",

    parse: function (response) {
      console.log("****ContactCollection - parse");
      console.log("response: ", response);
      response = response || {};
      var hosts = response.hosts || [];
      var errs = response.err || [];
      console.log("hosts: ", hosts);
      var hostsLen = hosts.length;
      var errsLen = errs.length;
      console.log("hostsLen: ", hostsLen);
      var host;
      var i;
      for (i = 0; i < hostsLen; i++) {
        host = hosts[i];
        console.log("host: ", host);
        host.memCritical = (parseFloat(host.memUsed) / (parseFloat(host.memFree)
          + parseFloat(host.memUsed))) < 0.9
          ? false
          : true;
        host.loadCritical = (parseFloat(host.load) < 1)
          ? false
          : true;
      }

      for (i = 0; i < errsLen; i ++) {
        var err = errs[i];
        console.log("err: ", err);
        toastr.error(err.err, "Error with IP: " + err.ip)
      }

      return hosts;
    },
  });


  // Repository Controller
  // ------------------

  Dashboard.Repository = Marionette.Controller.extend({

    initialize: function () {
      console.log("Dashboard.Repository.Controller - initialize");
      this.hostCollection = new HostCollection();
    },

    getHostCollection: function () {
      console.log("Dashboard.Repository.Controller - getHostCollection");
      return this.hostCollection;
    },

    getAll: function(){
      console.log("Dashboard.Repository.Controller - getAll");
      var deferred = $.Deferred();

      this._getHosts(function(hosts){
        console.log("hosts: ", hosts)
        deferred.resolve(hosts);
      });

      return deferred.promise();
    },

    getById: function(ip){
      console.log("Dashboard.Repository.Controller - getById");
      console.log("----ip: ", ip);
      var deferred = $.Deferred();

      this._getVmInstances({ip: ip}, function(instanceList){
        console.log("----instanceList: ", instanceList);
        // var hosts = mailList.get(id);
        console.log("----resolving deffered promise");
        deferred.resolve(instanceList);
      });

      return deferred.promise();
    },


    _getHosts: function(callback){
      console.log("Dashboard.Repository.Controller - _getHosts");
      this.hostCollection.on("reset", callback);
      this.hostCollection.fetch();
    },

    _getVmInstances: function(options, callback){
      console.log("Dashboard.Repository.Controller - _getVmInstances");
      options = options || {};
      var ip = options.ip;
      var vmInstanceCollection = new VmInstanceCollection({
        ip: ip
      });
      vmInstanceCollection.on("reset", callback);
      console.log("----fecthing VmInstanceCollection");
      vmInstanceCollection.fetch();
    }
  });
});
