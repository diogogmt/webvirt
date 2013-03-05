var virtManager =  virtManager ||  {};

$(function () {

  var ChangePassword = function () {
    this.bindEventHandlers();
  }


  ChangePassword.prototype.getFormData = function () {
    // validate data here
    return {
      username: $("#username").val(),
      currentPassword: $("#currentPassword").val(),
      newPassword: $("#newPassword").val()
    }
  };


  ChangePassword.prototype.isFormValid = function () {
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

  ChangePassword.prototype.bindEventHandlers = function () {
    var self = this;
    $("#submit-form").click(function (e) {
      $.ajax({
        type: "POST",
        url: "/user/changePassword",
        data: self.getFormData(),
        success: function (data) {
          console.log("success");
          console.log("data: ", data);
          if (!data.err) {
            toastr.success('User password changed successfuly, redirecting to login page...', 'Success')
            setTimeout(function () {
              window.location = "/user/login"
            }, 1000);
          } else {
            toastr.error('A problem occured, please try again.', 'Error')
          }

        },
        error: function () {
          console.log("error");
        },
        complete: function () {
          console.log("complete");
        }
      });
      e.preventDefault();
      return false;
    });
  }

  virtManager.changePassword = new ChangePassword();
});