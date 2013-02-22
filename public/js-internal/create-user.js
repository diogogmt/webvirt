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
    url: "/user/create",
    data: getFormData(),
    success: function (data) {
      console.log("success");
      console.log("data: ", data);
      if (!data.err) {
        window.location = "/user/login";
      } else {
        console.log("An error occured, please try again.");
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