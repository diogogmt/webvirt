///////////////////////////////////////////////
//////// GLOBALS //////////////////////////////

var app = app || {};

// API Helper Object
app.API = {
  //// AJAX wrapper cb signatures:
  // [ success(data, textStatus, jqXHR) ]
  // [ error(jqXHR, textStatus, errorThrown) ]
  callServer:  function(call, success, error) {
    $.ajax({
      url: "/" + call,
      datatype: "json",
      cache: false,
      success: success,
      "error": error
    }); // END Ajax
  }, // END callServer 
} 
