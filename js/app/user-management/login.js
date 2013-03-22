var virtManager =  virtManager ||  {};

$(function () {

  var Login = function () {
    this.bindEventHandlers();
  }

  Login.prototype.getFormData = function () {
    // validate data here
    return {
      username: $("#username").val().trim(),
      password: $("#password").val()
    }
  };

  Login.prototype.isFormValid = function () {
    var formData = this.getFormData()
      , isValid = true;

    console.log("formData: ", formData);

    // Add more rules to the validation, min number of chars for example
    if (formData.username === "") {
      toastr.error('Please enter a valid username', 'Error');
      $("#username").focus();
      isValid = false;      
    } else if (formData.password == "") {
      toastr.error('Please enter a valid password', 'Error')      
      $("#password").focus();
      isValid = false;      
    }

    return isValid;
  }

  Login.prototype.bindEventHandlers = function () {
    var self = this;
    $("#submit-form-login").click(function (e) {
      e.preventDefault();
      if (!self.isFormValid()) {
        return false;
      }
      $.ajax({
        type: "POST",
        url: "/user/auth",
        data: self.getFormData(),
        success: function (data) {
          window.location = "/";
        },
        error: function (xhr) {
          toastr.error('A problem occured, please try again.', 'Error')
        },
        complete: function () {
          console.log("complete");
        }
      });
      return false;
    });
  };

  virtManager.login = new Login();

});