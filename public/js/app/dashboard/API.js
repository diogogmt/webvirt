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
      error: function(textStatus) {
        // INTERFACE-SERVER ERROR HANDLING
        switch (textStatus) {
          case "null":
          case "timeout":
          case "error":
          case "abort":
          case "parsererror": 
          default:
            error();  
            break;
        } // END Switch
      } // END Error
    }); // END Ajax
  }, // END callServer 
} 
