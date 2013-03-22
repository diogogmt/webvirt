
var app = app || {};

app.Instance = Backbone.Model.extend({
  initialize: function () {
  },

  sendCommand: function () {

  },

  urlRoot: function () {
    return ('/status/' + this.get("ip") + "/");
  },

  parse: function (res) {
    var copy;

    if (res.data) {
      copy = this.toJSON();
      copy.status = res.data;
    } 
    else if (res.err) {
      toastr.error(res.err);
    } 
    else
      copy = res;   

    return copy;
  }
  
});