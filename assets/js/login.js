// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQOGFPzTZ3o5WLnsuyqlk4TEyxFSaVAO0",
    authDomain: "exemplar-ae432.firebaseapp.com",
    databaseURL: "https://exemplar-ae432.firebaseio.com",
    projectId: "exemplar-ae432",
    storageBucket: "gs://exemplar-ae432.appspot.com/",
    messagingSenderId: "893766502988"
  };
  firebase.initializeApp(config);

  var newaccount = false;

// ////Github account //////////////
var provider = new firebase.auth.GithubAuthProvider();

$('#github').on('click', function(event) {
  event.preventDefault();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(user);
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    //   // The email of the user's account used.
    var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(errorMessage);
  });
});

// ////////Listening Login with email and password////////
$('#login').on('click', function(e) {
  newaccount = false;
  e.preventDefault();
  // var auth = firebase.auth();
  var email = $('#username').val();
  var pass = $('#password').val();
  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(e){
    console.log('error ', e);
  });
  // promise.then(function(){
  //   console.log('promises and stuff');
  // })
  // promise.catch(function(event) {
  //      alert(event.message);
  // });
});


// /////////////////////////////////////////storing Porfile Image///////////////////////////////////////////////////////////////////
var file;
$(document).on('change', '#imgFile', function(e) {
  e.preventDefault();
  file = e.target.files[0] || '';
  console.log(file.name);
});
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ///////Submitting form to sign up clicking button.... all user info is stored in firebase with specific UID/////////
$(document).on('click', '#submitAccount', account);


function account() {

    event.preventDefault();
    var auth = firebase.auth();
    var users = {
      email: $('#email').val(),
      pass: $('#account-password').val()
    };


    // ////////Calling firebase method to create user account with email an password///////////
    auth.createUserWithEmailAndPassword(users.email, users.pass).catch(function(error) {
        // Handle Errors
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          $('#register-error-message').html(error.message);
        } else {
          $('#register-error-message').html(error.message);
        }
          $('#register-error-message').html(error.code);
      });
  newaccount = true;
}



    // //////event listenner whenever there is a change of Auth State signing in or signing up////////
    firebase.auth().onAuthStateChanged(function(user) {
    ///////if user signed in or singed up updating user account properties///////
      if (user) {

            if (newaccount){

              console.log("resim girisi ");
              var storageRef = firebase.storage().ref(user["uid"]+ '/' + file.name);
              storageRef.put(file);
                console.log("resim koyuldu ");

                  user.updateProfile(
                          {
                            displayName: $('#name').val(),
                            photoURL: file.name
                          }).then(function () {
                            console.log('Update is successfull');
                            firebase.database().ref('users/' + user.uid).set({
                                email: $('#email').val(),
                                pass: $('#account-password').val(),
                                displayName: $('#name').val(),
                                lastName: $('#lastName').val(),
                                aboutMe: "Please Edit About Me Section",
                                Notes: "",
                                profession: $('#profession').val(),
                                country: $('#country').val(),
                                imgUrl: file.name
                              }, function (err) {
                                if (err) {
                                  console.log(err);
                                } else {
                                window.location = 'main.html';
                                }
                              });
                            }, function (error) {
                              console.log('not able to update user info');
                              console.log(error);
                            });
                        } else {
                          window.location = 'main.html';
                        }
        } else {
          console.log('not logged in');
        }
      });






////////////LogIn Display Change//////////////////
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














































    // // /////New user signing in with new email and password. Creating Account/////////
    // $(document).on('click', '#signup', signUp);
    //
    // // ///////signup function creates a form with name lastname email password img form/////////
    // function signUp() {
    //   event.preventDefault();
    //   var divSign = $("<div id = 'divSign'>");
    //   var name = $("<input type = 'text' placeholder = 'First Name'>");
    //   name.addClass('form-control');
    //   name.attr('id', 'name');
    //
    //   var lastName = $("<input type = 'text' placeholder = 'Last Name'>");
    //   lastName.addClass('form-control');
    //   lastName.attr('id', 'lastName');
    //   divSign.insertAfter($('#signInHeader'));
    //   divSign.append(name);
    //   divSign.append(lastName);
    //
    //   var profession = $("<input type = 'text' placeholder = 'Profesion'>");
    //   profession.addClass('form-control');
    //   profession.attr('id', 'profession');
    //   profession.insertAfter(lastName);
    //
    //   var country = $("<input type = 'text' placeholder = 'Country'>");
    //   country.addClass('form-control');
    //   country.attr('id', 'country');
    //   country.insertAfter(profession);
    //
    //   var label = $("<label for = 'imgFile'>");
    //   label.text('Image File');
    //   var file = $("<input type = 'file' aria-describedby='fileHelp'>");
    //   file.addClass('form-control-file');
    //   file.attr('id', 'imgFile');
    //   label.insertAfter(country);
    //   file.insertAfter(label);
    //   $('#login').remove();
    //   $('#github').remove();
    //   $('#signup').remove();
    //
    //   var buttonSignUp = $("<button class = 'btn btn-primary' id = 'submitAccount'>");
    //   buttonSignUp.text('Submit');
    //   buttonSignUp.insertAfter($('#password'));
    //
    //   var cancel = $("<button class = 'btn btn-success' id = 'cancel'>");
    //   var tag = $("<a href = 'logIn.html'>");
    //   tag.text('Cancel');
    //   cancel.insertAfter($('#submitAccount'));
    //   cancel.append(tag);
    // }
