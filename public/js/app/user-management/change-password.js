var virtManager =  virtManager ||  {};

$(function () {

  var ChangePassword = function () {
    this.bindEventHandlers();
  }


  ChangePassword.prototype.getFormData = function () {
    return {
      username: $("#username").val(),
      currentPassword: $("#currentPassword").val(),
      newPassword: $("#newPassword").val()
    }
  };


  ChangePassword.prototype.isFormValid = function () {
    var $newPasswordConfirm = $("#newPasswordConfirm")
      , $newPassword = $("#newPassword")
      , $username = $("#username")
      , $currentPassword = $("#currentPassword")
      , isValid = true;

    // Add more rules to the validation, min number of chars for example
    if ($username.val() === "") {
      toastr.error("Please enter an username.", 'Error')
      $username.focus()
      isValid = false;
    } else if ($currentPassword.val() === "") {
      toastr.error("Please enter a password.", 'Error')
      $currentPassword.focus()
      isValid = false;
    } else if ($newPasswordConfirm.val() != $newPassword.val()) {
      toastr.error("Password don't match.", 'Error')
      $newPassword.val("");
      $newPasswordConfirm.val("");
      $newPassword.focus();
      isValid = false;
    } else if ($newPassword.val() === "") {
      toastr.error("Please enter a password.", 'Error')
      $newPassword.focus();
      isValid = false;
    } else if ($newPasswordConfirm === "") {
      toastr.error("Please enter a password.", 'Error')
      $newPasswordConfirm.focus();
      isValid = false;
    }

    return isValid;
  }

  ChangePassword.prototype.bindEventHandlers = function () {
    var self = this;
    $("#submit-form").click(function (e) {
      e.preventDefault();
      if (self.isFormValid()) {
        return false;
      }
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
      }); // end ajax
  }); // end submit-form click
}

  virtManager.changePassword = new ChangePassword();
});