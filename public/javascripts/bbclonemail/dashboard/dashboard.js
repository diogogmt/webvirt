console.log("mail.js");
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
      this.url = "http://142.204.133.138:3000/list/vms/" + this.ip;
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
    url: "http://142.204.133.138:3000/list/models/hosts",

    parse: function (response) {
      console.log("****ContactCollection - parse");
      console.log("response: ", response);
      console.log("response.length: ", response.length);
      response = response || {};
      var hosts = response.hosts || [];
      console.log("hosts: ", hosts);
      var hostsLen = hosts.length;
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

      return hosts;
    },
  });
























  // Repository Controller
  // ------------------

  Dashboard.Repository = Marionette.Controller.extend({

    initialize: function () {
      console.log("Dashboard.Repository.Controller - initialize");
      this.emailCollection = new HostCollection();
      // this.emailCollection.fetch();
    },

    getEmailCollection: function () {
      console.log("Dashboard.Repository.Controller - getEmailCollection");
      return this.emailCollection;
    },

    getAll: function(){
      console.log("Dashboard.Repository.Controller - getAll");
      var deferred = $.Deferred();

      this._getMail(function(mail){
        console.log("mail: ", mail)
        deferred.resolve(mail);
      });

      return deferred.promise();
    },

    getById: function(ip){
      console.log("Dashboard.Repository.Controller - getById");
      console.log("----ip: ", ip);
      var deferred = $.Deferred();

      this._getVmInstances({ip: ip}, function(instanceList){
        console.log("----instanceList: ", instanceList);
        // var mail = mailList.get(id);
        console.log("----resolving deffered promise");
        deferred.resolve(instanceList);
      });

      return deferred.promise();
    },

    

    _getMail: function(callback){
      console.log("Dashboard.Repository.Controller - _getMail");
      this.emailCollection.on("reset", callback);
      this.emailCollection.fetch();
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
