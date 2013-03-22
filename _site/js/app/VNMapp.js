/* ************************************** * 
 * * VirshNode Manager Web Application ** *
 * **************************************  */
 
var app = app || {};

$(function() {
  console.log("[creating hosts]");
  app.Hosts = new app.HostList();

  console.log("[creating controller]");
  app.controller = new app.Controller();

  console.log("[creating router");
  app.Routes = new app.Dashboard();
  Backbone.history.start();

  if (typeof(app.loaded) === "undefined") {
  	app.Routes.trigger("route:gotoDashboard");
  	app.Routes.navigate("dashboard");
  }

  console.log("[creating daemon list]");
  app.Daemons = new DaemonsList();

  // console.log("[creating log controller]");
  // new app.LogController();

  // app.LogInfoList = new app.InfoList();
}) // END Application
