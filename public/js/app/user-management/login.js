var getFormData = function () {
  // validate data here
  return {
    username: $("#username").val(),
    password: $("#password").val()
  }
};
$("#submit-form").click(function (e) {
  console.log("getFormData: ", getFormData());
  $.ajax({
    type: "POST",
    url: "/user/auth",
    data: getFormData(),
    success: function (data) {
      console.log("success");
      console.log("data: ", data);
      if (!data.err) {
        console.log("User authenticated, moving to the next step.");
        window.location = "/";
      } else {
        console.log("authentication failed, please try again");
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