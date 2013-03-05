var virtManager =  virtManager ||  {};

$(function () {

  var CreateUser = function () {

    this.bindEventHandlers();
  }
  CreateUser.prototype.getFormData = function () {
    // validate data here
    return {
      username: $("#username").val(),
      password: $("#password").val()
    }
  };

  CreateUser.prototype.isFormValid = function () {
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

  CreateUser.prototype.bindEventHandlers = function () {
    var self = this;
    $("#submit-form").click(function (e) {
      console.log("getFormData: ", self.getFormData());
      e.preventDefault();

      if (!self.isFormValid()) {
        return false;
      }

      $.ajax({
        type: "POST",
        url: "/user/create",
        data: self.getFormData(),
        success: function (data) {
          console.log("success");
          console.log("data: ", data);
          if (!data.err) {
            toastr.success('User successfuly created, redirecting to login page...', 'Success')
            setTimeout(function () {
              window.location = "/user/login"
            }, 3000);
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
      return false;
    });
  }

  virtManager.createUser = new CreateUser();

});

