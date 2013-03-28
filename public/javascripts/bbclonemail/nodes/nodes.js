BBCloneMail.module("NodesApp.Nodes", function(Nodes, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

var Node = Backbone.Model.extend({
  defaults: {
    ip: ''
  },

  idAttribute: "customId",

  initialize: function () {
    console.log("Node.Model - initialize");
  },

  validate: function (attrs, options) {
    console.log("Node.Model - validate");
    // console.log("----attrs: ", attrs);
    // console.log("----options: ", options);
    // var ip = attrs["ip"] || null
    //   , match = ip && ip.match(/^(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!0)(?!255)\d{1,3}$/)
    //   , len = match && match.length || 0;
    
    // console.log("----ip: ", ip);
    // if (len != 1) {
    //   console.log("----ip: ", ip);
    //   console.log("----match: ", match);
    //   console.log("----len: ", len);
    //   console.log("---Invalid IP");
    //   return "Invalid IP";
    // }
  }
});


  var NodeCollection = Backbone.Collection.extend({
    model: Node,

    initialize: function (options) {
      console.log("NodeCollection - initialize");
    },

    url: function () {
      console.log("NodeCollection - url");
      var url = "/daemons/";
      return url;
    },

    parse: function (response) {
      console.log("********\n\nNodeCollection - pasre");
      console.log("response: ", response);
      var data = _.map(response, function (ip) {
        return {
          customId: ip,
          ip: ip
        };
      });
      console.log("data: ", data);
      return data;
    },

  });

  // Nodes Repository
  // -------------------

  Nodes.Repository = Marionette.Controller.extend({

    initialize: function (options) {
      console.log("Nodes.Repository - initialize");
      this.options = options;
      this.isLogFull = false;

    },

    getAll: function(options){
      console.log("Nodes.Repository - getAll");
      var deferred = $.Deferred();

      this._getNodes(options, function(nodes){
        deferred.resolve(nodes);
      });

      return deferred.promise();
    },

    createNode: function (data, options) {
      console.log("Nodes.Repository - createNode");
      console.log("----data: ", data);
      console.log("----options: ", options);
      console.log("----creating node");
      var node = this.nodeCollection.create(data, options);
      // var ip = data.ip;
      // var node = new Node();
      // node.url = "/daemons";
      // console.log("saving node");
      // node.save("ip", ip, options);
      // console.log

      if (node.validationError) {
        console.log("Failed to add daemon " + ip, 'An error occured.');
      }
    },

    deleteNode: function (ip, options) {
      console.log("Nodes.Repository - deleteNode");
      console.log("----ip: ", ip);
      console.log("----this.nodeCollection: ", this.nodeCollection);
      console.log("----this.nodeCollection(ip): ", this.nodeCollection.get(ip));
      console.log("----destroying node");
      this.nodeCollection.get(ip).destroy(options);
    },

    _getNodes: function(options, callback){
      console.log("Nodes.Repository - _getNodes");
      this.nodeCollection = new NodeCollection();
      this.nodeCollection.on("reset", callback);
      this.nodeCollection.on("remove", Marionette.triggerMethod.call(App.NodesApp.controller, "nodes:sync"));
      // this.nodeCollection.on("add", Marionette.triggerMethod.call(App.NodesApp.controller, "nodes:show"));
      this.nodeCollection.on("sync", Marionette.triggerMethod.call(App.NodesApp.controller, "nodes:sync"));

      this.nodeCollection.fetch(options);
    } // end _getNodes
  });
});
