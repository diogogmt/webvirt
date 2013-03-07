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
          toastr.success('Redirecting to login page...', 'Password upated')
          setTimeout(function () {
            window.location = "/user/login"
          }, 1000);

        },
        error: function (xhr) {
          toastr.error(xhr.responseText, 'Error')
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