// to flip between two tabs
$('#login-form-link').click(function (e) {
  $('#login-form').delay(100).fadeIn(100);
  $('#register-form').fadeOut(100);
  $('#register-form-link').removeClass('active');
  $(this).addClass('active');
  e.preventDefault();
});
$('#register-form-link').click(function (e) {
  $('#register-form').delay(100).fadeIn(100);
  $('#login-form').fadeOut(100);
  $('#login-form-link').removeClass('active');
  $(this).addClass('active');
  e.preventDefault();
});

// variable to set displayName
var registeringNewUser = false;

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBQOGFPzTZ3o5WLnsuyqlk4TEyxFSaVAO0',
  authDomain: 'exemplar-ae432.firebaseapp.com',
  databaseURL: 'https://exemplar-ae432.firebaseio.com',
  projectId: 'exemplar-ae432',
  storageBucket: 'exemplar-ae432.appspot.com',
  messagingSenderId: '893766502988'
};
firebase.initializeApp(config);

// ////////Listening Login with email and password////////
$('#login-submit').on('click', function (e) {
  e.preventDefault();

  // make sure authentication doesn't try to update display name
  registeringNewUser = false;
  var auth = firebase.auth();
  var email = $('#username').val();
  var pass = $('#password').val();
  var promise = auth.signInWithEmailAndPassword(email, pass);

  // if invalid login then display error message
  promise.catch(function (event) {
    $('#error-message').html(event.message);
  });
});

// ///////Submitting form to sign up clicking button.... all user info is stored in firebase with specific UID/////////
$(document).on('click', '#register-submit', registerNewUser);

function registerNewUser () {
  registeringNewUser = true;
  event.preventDefault();
  var auth = firebase.auth();
  var users = {
    email: $('#email').val(),
    pass: $('#register-password').val()
  };

  // ////////Calling firebase method to create user account with email an password///////////
  auth.createUserWithEmailAndPassword(users.email, users.pass).catch(function (error) {
    // Handle Errors
    // var errorCode = error.code;
    $('#register-error-message').html(error.message);
  }).then(function (response) {});
}

// //////event listenner whenever there is a change of Auth State signing in or signing up////////
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (registeringNewUser) {
      // update displayname
      user.updateProfile(
        {
          displayName: $('#first-name').val()
          // photoURL: file.name
        }).then(function () {
          console.log('Update is successfull');
          firebase.database().ref('users/' + user.uid).set({
            email: $('#email').val(),
          // pass: users.pass,
            displayName: $('#first-name').val(),
            lastName: $('#last-name').val(),
            aboutMe: 'Please edit the about me section.',
            Notes: 'Add notes here',
            profession: 'Enter Occupation',
            paperTitle: '',
            paperTime: ''
          // imgUrl: file.name
          }, function (err) {
            if (err) {
              console.log(err);
            } else {
              window.location = 'index.html';
            }
          });
        }, function (error) {
          console.log('not able to update user info');
          console.log(error);
        });
    } else {
      window.location = 'index.html';
    }
  } else {
    console.log('not logged in');
  }
});
