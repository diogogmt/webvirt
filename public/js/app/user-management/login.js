var virtManager =  virtManager ||  {};

$(function () {

  var Login = function () {
    this.bindEventHandlers();
  }

  Login.prototype.getFormData = function () {
    // validate data here
    return {
      username: $("#username").val(),
      password: $("#password").val()
    }
  };

  Login.prototype.isFormValid = function () {
    var formData = this.getFormData()
      , isValid = true;

    console.log("formData: ", formData);

    // Add more rules to the validation, min number of chars for example
    if (formData.username === "") {
      toastr.error('Please enter a valid username', 'Error')
      isValid = false;      
    }

    if (formData.password == "") {
      toastr.error('Please enter a valid password', 'Error')      
      isValid = false;      
    }

    return isValid;
  }

  Login.prototype.bindEventHandlers = function () {
    var self = this;
    $("#submit-form-login").click(function (e) {
      $.ajax({
        type: "POST",
        url: "/user/auth",
        data: self.getFormData(),
        success: function (data) {
          console.log("success");
          if (!data.err) {
            window.location = "/";
          } else {
            toastr.error('A problem occured, please try again.', 'Error')
          }
        },
        error: function () {
          toastr.error('A problem occured, please try again.', 'Error')
        },
        complete: function () {
          console.log("complete");
        }
      });
      e.preventDefault();
      return false;
    });
  };

  virtManager.login = new Login();

});