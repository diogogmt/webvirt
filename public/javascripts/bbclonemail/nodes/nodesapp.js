BBCloneMail.module("NodesApp", function(NodesApp, App){
  "use strict";
 
  // Contact List Views
  // ------------------

  NodesApp.EmptyView = Marionette.ItemView.extend({
    template: "#node-manager-empty-template",
  });


  NodesApp.NodeView = Marionette.ItemView.extend({
    template: "#node-item-template",

    tagName: "li",

    events: {
      'click .deleteBtn':  'deleteDaemon',
    },

    deleteDaemon: function (e) {
      console.log("NodesApp.NavView - deleteDaemon");
      var ip = $(e.currentTarget).data("ip");
      console.log("----ip: ", ip);
      console.log("----trigerring method node:delete");
      Marionette.triggerMethod.call(NodesApp.controller, "node:delete", ip);
    },

  });

  NodesApp.NodeListView = Marionette.CollectionView.extend({
    itemView: NodesApp.NodeView,
    tagName: "ul",
    id: "contact-list",
    className: "contact-list"
  });
  

  NodesApp.NavView = Marionette.ItemView.extend({
    template: "#node-nav-template",

    events: {
      'click #addDaemon': 'createDaemon',
    },

    createDaemon: function (e) {
      console.log("NodesApp.NavView - createDaemon");
      var ip = $("#newDaemon").val();
      $("#newDaemon").val("");
      console.log("ip: ", ip);
      Marionette.triggerMethod.call(NodesApp.controller, "node:create", ip);
    },

  });

  // Contact App Controller
  // -----------------------

  NodesApp.Controller = App.AppController.extend({
    initialize: function(options){
      console.log("NodesApp.Controller - initialize");
      this.repo = options.repo;
      var that = this;

      $('input[id=file]').change(function() {
        $('#pretty-input').val($(this).val().replace("C:\\fakepath\\", ""));
      });

    },

    bindAjaxUploadForm: function () {
      console.log("NodesApp.Controller - bindAjaxUploadForm");
      var that = this;
      $("#hostManagementForm").ajaxForm({
        url: "/daemons/upload",
        type: "POST",
        dataType: "json",
        clearForm: true,
        beforeSubmit: function (formData, jqForm, options) {
          console.log("beforeSubmit");
          // formData is an array of objects containing the values of the form
          // jqForm is the html form element
          // options are the object initialized with ajaxForm
          // maybe validate the for before submiting
          // if form is not valid return false
          console.log("formData: ", formData);
          console.log("jqForm: ", jqForm);
          console.log("options: ", options);
          console.log("----showing loading icon");
          that.showLoadingIcon(that.mainRegion);
          return true;;
        },
        success: function (res) {
          console.log("\n\n************\n\nAJAXFORM success\n");
          console.log("res: ", res);
          for (var key in res) {
            var err = res[key];
            console.log("err: ", err);
            if (err) {
              toastr.error(err, "Error");
              continue;
            } 
            toastr.success("Added WebVirt Node " + key, "Success");
          }
          
          console.log("showing nodes");
          that.showNodes();
        },
        error: function (res) {
          console.log("ajaxform error");
          toastr.error(res.responseText, "Error");
          that.renderNodesEmpty();
        },
        complete: function () {
          console.log("ajaxform complete");
        }
      });
    },

    onShow: function(){
      console.log("NodesApp.Controller - onShow");
    },

    onNodeCreate: function(ip){
      console.log("NodesApp.Controller - onNodeCreate");
      console.log("creating new node");

      var that = this;
      var data = {
        'ip': ip,
        'customId': ip,
      }

      var options = {
        'wait': true,
        'success': function (model, res) {
          console.log("nodeCollection.create - success");
          console.log("arguments: ", arguments);
          console.log("----that.repo.nodeCollection: ", that.repo.nodeCollection);
          console.log("----that.repo.nodeCollection.length: ", that.repo.nodeCollection.length);
          if (that.repo.nodeCollection.length === 1) {
            console.log("---rendering nodes list");
            that.renderNodesList();
          }
          toastr.success("Added WebVirt Node " + model.id, "Success");

        },
        'error': function (model, res) {
          console.log("nodeCollection.create - error");
          console.log("arguments: ", arguments);
          toastr.error(res.responseText, "Error");
        },
      }

      this.repo.createNode(data, options);
    },

    onNodeDelete: function(ip){
      console.log("NodesApp.Controller - onNodeDelete");
      console.log("deleting node from repo");
      var that = this;
      var options = {
        'wait': true,
        'success': function (model, res) {
          console.log("onNodeDelete - success");
          console.log("arguments: ", arguments);
          console.log("----that.repo.nodeCollection: ", that.repo.nodeCollection);
          console.log("----that.repo.nodeCollection.length: ", that.repo.nodeCollection.length);
          if (!that.repo.nodeCollection.length) {
            console.log("---no more nodes in the list");
            that.renderNodesEmpty();
          }
          toastr.success("Removed WebVirt Node " + model.id, "Success");

        },
        'error': function (model, res) {
          console.log("onNodeDelete - error");
          console.log("arguments: ", arguments);
          toastr.error(res.responseText, "Error");
        },
      }
      this.repo.deleteNode(ip, options);
    },

    onNodesShow: function(){
      console.log("NodesApp.Controller - onNodesShow");
      this.showNodes;
    },

    renderNodesList: function(collection){
      console.log("\n\n*****\nNodesApp.Controller - renderNodesList\n\n");
      var collection = this.repo.nodeCollection;
      console.log("collection: ", collection);
      var view = new NodesApp.NodeListView({
        collection: collection
      });

      console.log("----view: ", view);
      console.log("----showing view on mainRegion")
      this.mainRegion.show(view);
    },

    renderNodesEmpty: function(){
      console.log("\n\n*****\nNodesApp.Controller - renderNodesEmpty\n\n");
      var view = new NodesApp.EmptyView({
      });

      console.log("----view: ", view);
      console.log("----showing view on mainRegion")
      this.mainRegion.show(view);
    },

    showAddWidgets: function(){
      console.log("NodesApp.Controller - showAddWidgetss");
      var categoryNav = new NodesApp.NavView();
      this.mainNavRegion.show(categoryNav);
      this.bindAjaxUploadForm();
    },

    showNodes: function(){
      console.log("NodesApp.Controller - showNodes");
      var that = this;
      
      var options = {
        'success': function (collection, res) {
          console.log("nodeCollection.fetch - success");
          console.log("---collection: ", collection);
          console.log("---collection.length: ", collection.length);
          that.renderNodesList(collection);
        },
        'error': function (collection, res) {
          console.log("nodeCollection.fetch - error");
          console.log("arguments: ", arguments);
          that.renderNodesEmpty();
          toastr.error(res.responseText, "Error");
        },
      }

      $.when(this.repo.getAll(options)).then(function(nodes){
        console.log("----when callback");
        console.log("----nodes: ", nodes);
        
        // that.mainRegion.open(view);

        Backbone.history.navigate("nodes");
      }); // end when
    }, // end showNodes

  });

  // Initializers and Finalizers
  // ---------------------------

  NodesApp.addInitializer(function(args){
    console.log("NodesApp.addInitializer");

    var repo = new NodesApp.Nodes.Repository();

    NodesApp.controller = new NodesApp.Controller({
      content1Region: args.content1Region,
      mainRegion: args.mainRegion,
      mainNavRegion: args.mainNavRegion,
      mainFooterRegion: args.mainFooterRegion,
      navRegion: args.navRegion,
      appSelectorRegion: args.appSelectorRegion,
      tempHolderRegion: args.tempHolderRegion,
      repo: repo
    });

    NodesApp.controller.show();
    App.vent.trigger("app:started", "nodes");
  });

  NodesApp.addFinalizer(function(){
    console.log("NodesApp.addFinalizer");
    if (NodesApp.controller){
      console.log("---- closing regions");
      App._regionManager._regions.main.close();
      App._regionManager._regions.mainNav.close();
      App._regionManager._regions.mainFooter.close();

      NodesApp.controller.mainRegion = NodesApp.controller.tempHolderRegion;
      NodesApp.controller.mainNavRegion = NodesApp.controller.tempHolderRegion;
      NodesApp.controller.mainFooterRegion = NodesApp.controller.tempHolderRegion;
      NodesApp.controller.content1Region = NodesApp.controller.tempHolderRegion;
      NodesApp.controller.navRegion = NodesApp.controller.tempHolderRegion;

      NodesApp.controller.close();
      delete NodesApp.controller;
    }
  });

});
