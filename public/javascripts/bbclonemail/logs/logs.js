console.log("contacts.js");

BBCloneMail.module("LogsApp.Logs", function(Logs, App, Backbone, Marionette, $, _){
  "use strict";

  // Entities
  // --------

  var Log = Backbone.Model.extend({
    defaults: {
      'timestamp' : '',
      'file'      : '',
      'line'      : '',
      'message'   : '',
    },

    idAttribute: "id",

    initialize: function () {
      console.log("Log.Model - initialize");
    },

    save: function () {
      console.log("Log.Model - save");
      return true;
    }
  });



  var LogCollection = Backbone.Collection.extend({
    model: Log,

    initialize: function (options) {
      console.log("LogCollection - initialize");
      console.log("options: ", options);
      options = options || {};
      this.start = options.start || 1;
      this.rows = options.rows || 10;
      this.type = options.type || 'redis';
      this.level = options.level || 'error';
      this.viewMore =  options.viewMore || true;
      this.repo = options.repo;
    },

    url: function () {
      console.log("LogCollection - url");
      var url = "http://142.204.133.138:3000/logs/" + this.type + "/" + this.level + "/" + this.start + "/" + this.rows;
      console.log("url: ", url);
      return url;
    },

    fetch: function () {
      console.log("LogCollection - fetch");
      var that = this;
      if (this.start === 1) {
        console.log("--- fecthing for the first time");
        var options = {
          success: function (model, response) {
            console.log("----LogCollection - fetch - success callback");
            console.log("----LEVEL: ", that.level);
          },
          error: function (model, response) {
            console.log("----LogCollection - fetch - error callback");
            console.log("----LEVEL: ", that.level);
          },
          complete: function (model, response) {
            console.log("----LogCollection - fetch - complete callback");
            console.log("----LEVEL: ", that.level);
          },
        };
      } else {
        console.log("--- logs were already fecthing, this time just  updatind")
        var options = {
          success: function (model, response) {
            console.log("----LogCollection - fetch - success callback");
            console.log("----LEVEL: ", that.level);
          },
          error: function (model, response) {
            console.log("----LogCollection - fetch - error callback");
            console.log("----LEVEL: ", that.level);
          },
          complete: function (model, response) {
            console.log("----LogCollection - fetch - complete callback");
            console.log("----LEVEL: ", that.level);
          },
          update: true,
          remove: false,
          merge: false
        };
      }

      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function (response) {
      console.log("****LogCollection - parse");
      console.log("response.length: ", response.length);
      console.log("this.rows: ", this.rows);
      console.log("this.start: ", this.start);

      if (response.length < this.rows - this.start) {
        // Trigger signal to hide viewMore button
        this.viewMore = false;
        this.repo.hasSpace(false);
      }

      // Increment logs range
      this.start += response.length;
      this.rows += response.length;
      console.log("response: ", response);

      return response;
    },

    viewMoreStatus: function () {
      console.log("LogCollection - viewMoreStatus");
      return this.viewMore;
    }
  });

  // Logs Repository
  // -------------------

  Logs.Repository = Marionette.Controller.extend({

    initialize: function (options) {
      console.log("Logs.Repository - initialize");
      this.options = options;
      this.options.repo = this;

      this._hasSpace = true;
      this._wasFetched = false;

      this.logCollection = new LogCollection(this.options);
    },

    // getAll: function(){
    //   console.log("Logs.Repository - getAll");
    //   return this.logCollection;
    // },

    hasSpace: function (flag) {
      console.log("Logs.Repository - hasSpace");
      console.log("----flag: ", flag);
      if (!_.isUndefined(flag)) {
        this._hasSpace = flag;
      }
      console.log("----flag: ", flag);
      return this._hasSpace;
    },

    wasFetched: function (flag) {
      console.log("Logs.Repository - hasSpace");
      console.log("----flag: ", flag);
      if (!_.isUndefined(flag)) {
        this._wasFetched = flag;
      }
      console.log("----flag: ", flag);
      return this._wasFetched;
    },

    _getAll: function (fetch, callback) {
      console.log("Logs.Repository - _getAll");
      console.log("----fetch: ", fetch);
      console.log("----this._wasFetched: ", this._wasFetched);
      if (!fetch) {
        callback(this.logCollection);
        return;
      }

      this._wasFetched = true;

      this.logCollection.on("sync", callback);
      console.log("----fecthing LogCollection");
      this.logCollection.fetch();
    },

    getAll: function (fetch) {
      console.log("Logs.Repository - getAll");
      console.log("----fetch: ", fetch);

      var deferred = $.Deferred();
      var that = this;
      this._getAll(fetch, function(){
        console.log("---_getAll callback");
        deferred.resolve(that.logCollection);
      });

      return deferred.promise();
    },

    _showMore: function (callback) {
      console.log("Logs.Repository - _showMore");
      this.logCollection.on("sync", callback);
      console.log("----fecthing LogCollection");
      this.logCollection.fetch();
    },

    showMore: function () {
      console.log("Logs.Repository - showMore");

      var deferred = $.Deferred();
      var that = this;
      this._showMore(function(){
        console.log("---_showMore callback");
        deferred.resolve(that.logCollection);
      });

      return deferred.promise();
    },

  });
});
