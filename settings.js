/*
  TODO:
    - Verify the email
*/

// Account Management
var submitButton = document.getElementById('submit');

submitButton.addEventListener("click", function() {
  var email = document.getElementById('email').value;
  var oldpass = document.getElementById('oldpass').value;
  var newpass = document.getElementById('newpass').value;
  var confirmpass = document.getElementById('confirmpass').value;

  // TODO: if the oldpass is correct
    // Add ERROR: Password incorrect

  if (newpass == confirmpass) {
    // Add ERROR: New password and confirm password do not match.
  }

  var data = {
    email: email,
    password: newpass
  }

  console.log(data);
  // TODO: Use sockets to send this to the database
})
