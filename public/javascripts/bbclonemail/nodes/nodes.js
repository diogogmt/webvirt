console.log("nodes.js");

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
    var ip = attrs["ip"] || null
      , match = ip && ip.match(/^(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!255)\d{1,3}\.(?!0)(?!255)\d{1,3}$/)
      , len = match && match.length || 0;
    
    if (len != 1) {
      return "Invalid IP";
    }
  }
});


  var NodeCollection = Backbone.Collection.extend({
    model: Node,

    initialize: function (options) {
      console.log("NodeCollection - initialize");
    },

    url: function () {
      console.log("NodeCollection - url");
      var url = "http://142.204.133.138:3000/daemons/";
      return url;
    },

    parse: function (response) {
      console.log("NodeCollection - pase");
      console.log("response: ", response);
      var data = _.map(response.daemons, function (ip) {
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

    getAll: function(){
      console.log("Nodes.Repository - getAll");
      var deferred = $.Deferred();

      this._getNodes(function(nodes){
        deferred.resolve(nodes);
      });

      return deferred.promise();
    },

    createNode: function (ip) {
      console.log("Nodes.Repository - createNode");
      console.log("----ip: ", ip);
      console.log("----destroying node");
      var node = 
      this.nodeCollection.create(
        {
          ip: ip
        },
        {
          'wait': true,
          'success': function (model, res) {
            console.log("nodeCollection.createNode - success");
            // var ip = model.get('ip');
            // toastr.success("Daemon with ip " + ip + " was successfuly added.", 'Success!');
          },
          'error': function (model, res) {
            console.log("nodeCollection.createNode - error");
            // var ip = model.get('ip');
            // toastr.error("Failed to add daemon " + ip, 'An error occured.');
          },
          'complete': function () {
            console.log("nodeCollection.createNode - complete");
          },
        }
      );

      if (node.validationError) {
        console.log("Failed to add daemon " + ip, 'An error occured.');
      }
    },

    deleteNode: function (ip) {
      console.log("Nodes.Repository - deleteNode");
      console.log("----ip: ", ip);
      console.log("----this.nodeCollection: ", this.nodeCollection);
      console.log("----this.nodeCollection(ip): ", this.nodeCollection.get(ip));
      console.log("----destroying node");
      this.nodeCollection.get(ip).destroy();
    },

    _getNodes: function(callback){
      console.log("Nodes.Repository - _getNodes");
      this.nodeCollection = new NodeCollection();
      this.nodeCollection.on("reset", callback);
      this.nodeCollection.on("remove", Marionette.triggerMethod.call(App.NodesApp.controller, "nodes:show"));
      this.nodeCollection.on("add", Marionette.triggerMethod.call(App.NodesApp.controller, "nodes:show"));
      
      this.nodeCollection.fetch();
    }
    
  });
});
