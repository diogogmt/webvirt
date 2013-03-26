console.log("NodesApp.js");
BBCloneMail.module("NodesApp", function(NodesApp, App){
  "use strict";
 
  // Contact List Views
  // ------------------

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
        url: "http://142.204.133.138:3000/daemons/upload",
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
        success: function (data) {
          console.log("ajaxform success");
          console.log("data: ", data);

          var data = data.data;
          var dataLen = data && data.length || 0;
          console.log("dataLen: ", dataLen);
          for (var i = 0; i < dataLen; i++) {
            var obj = data[i];
            console.log("obj: ", obj);
            if (obj.err) {
              console.log("Failed to add host " + obj.ip, 'An error occured.');
            } else {
              console.log("Add host " + obj.ip, 'Action completed.');
            }
          }
          console.log("showing nodes");
          that.showNodes();
        },
        error: function () {
          console.log("ajaxform error");
          that.showNodes();
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
      this.repo.createNode(ip);
    },

    onNodeDelete: function(ip){
      console.log("NodesApp.Controller - onNodeDelete");
      console.log("deleting node from repo");
      this.repo.deleteNode(ip);
    },

    onNodesShow: function(){
      console.log("NodesApp.Controller - onNodesShow");
      this.showNodes;
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
      

      $.when(this.repo.getAll()).then(function(nodes){
        console.log("when callback");
        var view = new NodesApp.NodeListView({
          collection: nodes
        });

        console.log("view: ", view);
        console.log("showing view on mainRegion")
        that.mainRegion.show(view);
        // that.mainRegion.open(view);

        Backbone.history.navigate("nodes");
      });
    },

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
