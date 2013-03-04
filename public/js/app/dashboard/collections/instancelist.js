
var app = app || {};

app.InstanceList = Backbone.Collection.extend({
  model: app.Instance,

  url: "/list/vms/",

  initialize: function() {
  },

  comparator: function(model) {
    return model.get("id");
  },

  parse: function(res) {
    if (res.err) {toastr.error(res.err); return {} };

    return res.instances;
  }
})