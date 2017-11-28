// variable declaration
var articleList = [];
var searchTerm;
var ref;
var timeClicked;  // to track when article was clicked
var timeStopped;  // to track when article was stopped
var currentIndex;
var videowatch= " ";
var youtube=0;
var study= 0;

// create div variables
var divArticleList = $('#article-list');
var divArticleCurrent = $('#article-current');
var divArtRed = $("#artRed");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQOGFPzTZ3o5WLnsuyqlk4TEyxFSaVAO0",
  authDomain: "exemplar-ae432.firebaseapp.com",
  databaseURL: "https://exemplar-ae432.firebaseio.com",
  projectId: "exemplar-ae432",
  storageBucket: "exemplar-ae432.appspot.com",
  messagingSenderId: "893766502988"
};
firebase.initializeApp(config);
var database = firebase.database();
// verifyUserLoggedIn();

/**
  * redirects to login page if user is not logged in
*/
function verifyUserLoggedIn(){
  var userLoggedIn = firebase.auth().currentUser;
  if(userLoggedIn){
    console.log("logged in");
  } else {
    // window.location = 'login2.html';
    console.log('not logged in');
    console.log(userLoggedIn);
  }

}



/**
  * @desc populate articles from search input into table of contents
*/
function populateArticleList () {
  divArticleList.html("<h4 class='text-center'>Table of Contents</h4>");
  articleList.forEach((article, index) => {
    var html = "<div class='article-title' value='" + index + "'>";
    html += article.title;
    html += '</div>';

    divArticleList.append(html);
  });
}

/**
  * @desc display the article that was clicked in the table of contents to center of the page
  * @param object article - the article that gets passed from divArticleList click listener
  * @param number currentIndex - the index article that got clicked - used to pass value to button clicked
*/
function displayCurrentArticle (article) {
  var articleID = article.link.split('/')[4];

  var html = '<h4>' + article.title + '</h4>';
  // html = html + '<iframe src="' + article.link + '" ></iframe>';
  html = html + article['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:description'];
  html = html + '<button id="outside-article" class="btn btn-primary" value="'+currentIndex+'"href="' + article.link + '" target="_blank">Click here for link</button>';

   /* add document in iframe
   * delete if we skip iframe
   html = html + '<iframe src="' + article.link + '" ></iframe>';
  */

  divArticleCurrent.html(html);
  divArtRed.append("<li>" + article.title + "</li>");/////////////////////////////////////////
}

// add click listener to each article title
divArticleList.on('click', '.article-title', function () {
  currentIndex = $(this).attr('value');
  displayCurrentArticle(articleList[currentIndex]);
 });

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////TIMER FOR CLICKED LINK/////////////////////////////////////
// ////////////////////////////////////////////////////////////////////
//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

// prevents the clock from being sped up unnecessarily
var clockRunning = false;
var converted;
// Our stopwatch object
var stopwatch = {

  time: 0,
  lap: 1,

  reset: function () {
    stopwatch.time = 0;
    stopwatch.lap = 1;

    // DONE: Change the "display" div to "00:00."
    $('#display').html('00:00');

    // DONE: Empty the "laps" div.
    $('#laps').html('');
  },
  start: function () {
    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(stopwatch.count, 1000);
      clockRunning = true;
    }
  },
  stop: function () {
    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  recordLap: function () {
    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);

    // DONE: Add the current lap and time to the "laps" div.
    $('#laps').append('<p>Lap ' + stopwatch.lap + ' : ' + converted + '</p>');

    // DONE: Increment lap by 1. Remember, we can't use "this" here.
    stopwatch.lap++;
  },
  count: function () {
    // DONE: increment time by 1, remember we cant use "this" here.
    stopwatch.time++;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    converted = stopwatch.timeConverter(stopwatch.time);
    // console.log(converted);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $('#display').html(converted);
  },
  timeConverter: function (t) {
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    if (minutes === 0) {
      minutes = '00';
    } else if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return minutes + ':' + seconds;
  }
};



// ///////stopping timer and pushing time to firebase/////////
$(document).on('click', '#stop', function () {
  // ref.once('value', function (user) {
  //   ref.child('paperTime').set(converted);
  // });
  timeStopped = new moment().unix();
  var timeRead = timeStopped-timeClicked;
  console.log('time difference: ', timeRead);


  //update time for subject
  var userID = firebase.auth().currentUser.uid;
  firebase.database().ref('/users/'+userID +'/papers/' + searchTerm).once('value', function(data) {
    // if object has a value then add time from database
    if(data.val().timeRead){
      var readHistory = data.val().timeRead + timeRead;
      var postDat = {
          timeRead: readHistory
      };
      firebase.database().ref('/users/' + userID + '/papers/' + searchTerm).update(postDat);
    }
    else{
      var postDat = {
          timeRead: timeRead
      };
      firebase.database().ref('/users/' + userID + '/papers/' + searchTerm).update(postDat);
    }

  if(data.val()[currentIndex]["timeRead"]){
    var readArticleHistory = data.val()[currentIndex]["timeRead"] + timeRead;
    var postDat = {
        timeRead: readArticleHistory
    };
    firebase.database().ref('/users/' + userID + '/papers/' + searchTerm + '/' + currentIndex).update(postDat)
  }
  else{
    var postDat = {
        timeRead: timeRead
    };
    firebase.database().ref('/users/' + userID + '/papers/' + searchTerm + '/' + currentIndex).update(postDat)
  }
});



  stopwatch.stop();
  $('#wrapper').toggleClass('show');
  $('.row').show();
  stopwatch.time = 0;
});

$(document).on('click','#outside-article', function(){
  console.log('got here');
  var userID = firebase.auth().currentUser.uid;
  currentIndex = $(this).attr('value');
  console.log('current index: ', currentIndex);

  var count = 0;
  var day = new Date();
  // ///////////controlling timer and appearance of timer and table///////
  timeClicked = new moment().unix();
  console.log('time clicked: ', timeClicked);
  stopwatch.start();
  $('.row').hide();
  $('#wrapper').toggleClass('show');
  window.open(articleList[currentIndex].link);

  var postData = {

    paperSearchTerm: searchTerm,
    paperTitle: articleList[currentIndex].title,
    paperLink: articleList[currentIndex].link,
    paperID: articleList[currentIndex].id,
    paperPublisher: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:publisher'],
    paperGenre: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:genre'],
    paperISSN: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:issn'],
    paperDate: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationDate'],
    paperPubName: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationName'],
    paperDate: day,
    paperTime: 'empty'
  };

  // TODO fix database reference to add papers/searchTerm instead of papers/dayTime
        // //////////updating the firebase with new data that clicked paper
  ref = firebase.database().ref('/users/' + userID + '/papers/' + searchTerm + '/' + currentIndex);
  firebase.database().ref('/users/' + userID + '/papers/' + searchTerm + '/' + currentIndex).update(postData);

})

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //listening any change on state of firebase
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);
  if (user) {
    $('#displayName').html(' Welcome ' + user.displayName + ' ' + user.email);
  } else {
    console.log('not logged in');
    window.location = 'index.html';
  }
});

$(document).on('click', '#logout', function () {
  event.preventDefault();

  firebase.auth().signOut().then(function () {
              // Sign-out successful. Back to log in page
    window.location = 'index.html';
  }).catch(function (error) {
              // Handling error
    console.log(error);
  });
});

$(document).on('click', '#newButton', function () {
  event.preventDefault();
  searchTerm = $('input').val().trim();
  var comment = $('input').val().trim();
  searchNatureAPI(comment);
  // add search term to iframe format

  // var iframe = '<iframe id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/?listType=search&list=' + searchTerm + '"frameborder="0" allowfullscreen></iframe>';

  // // add iframe to html
  // $('#ytNew').html(iframe);


   //COMMENTED OUT YOUTBE API

  // var request = gapi.client.youtube.search.list({
  //   part: 'snippet',
  //   type: 'video',
  //   q: encodeURIComponent($('input').val().trim()).replace(/%20/g, '+'),
  //   maxResults: 1,
  //   order: 'relevance',
  //   topicId: '/m/01k8wb', // knowledge topics only
  //   safeSearch: 'strict', // no inappropriate material
  //   publishedAfter: '2015-01-01T00:00:00Z'

  // });

   var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($('input').val().trim()).replace(/%20/g, "+"),
            maxResults: 1,
            order: "relevance",
            topicId: "/m/01k8wb",
            safeSearch: "strict",
            publishedAfter: "2015-01-01T00:00:00Z"
            

  // add iframe to html
  // $('#ytNew').html(iframe);
})

 // execute the request
  // function tplawesome (e, t) { res = e; for (var n = 0; n < t.length; n++) { res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) { return t[n][r]; }); } return res; }
  // request.execute(function (response) {
  //   var results = response.result;
  //   $('#ytNew').html('');
  //   $.each(results.items, function (index, item) {
  //     $.get('tpl.html', function (data) {
  //       $('#ytNew').append(tplawesome(data, [{'title': item.snippet.title, 'videoid': item.id.videoId}]));
  //     });
  //   });
  //         // resetVideoHeight();
  // });

        function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
       request.execute(function(response) {
          var results = response.result;
          $("#ytNew").html("");
          $.each(results.items, function(index, item) {
            $.get("tpl.html", function(data) {
                $("#ytNew").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
                console.log("#ytNew");
            });
          });
          resetVideoHeight();
          console.log(results)
          consol.log(results.items[0].id.videoId)
       });

});

//     $(window).on("resize", resetVideoHeight);

function resetVideoHeight() {
    $(".video").attr("controls", 2)
    // $("#ytNew").css("controls", 2)
    // player.getCurrentTime()
}

function init () {
  gapi.client.setApiKey('AIzaSyDZh8uYaoVKAcc9hYsRzC1o9HuQH3SwTYk');
  gapi.client.load('youtube', 'v3', function () {
        // yt api is ready
  });
}
// lines 310-356 come from https://github.com/FriesFlorian/viralvideos/blob/master/js/app.js
//videowatch= document.getElementsByClassName('ytp-time-current')[0].innerHTML

$(document).on('click', 'button.ytp-play-button', function () {
//document.getElementsByClassName("ytp-time-current")[0].textContent
//videowatch= document.getElementsByClassName('ytp-time-current')[0].innerHTML
//console.log(videowatch)

})
/**
  * @desc search natureAPI and populate list of titles in table of contents
  * @param string seach - string provided by user in input field
*/
function searchNatureAPI (search) {
  var apiURL = 'https://www.nature.com/opensearch/request?httpAccept=application/json&query=' + search;

  var data;
  fetch(apiURL).then(response => {
    return response.json();
  }).then(returnData => {
    // console.log(returnData.feed.entry);
    articleList = returnData.feed.entry;
    populateArticleList();
  });
}
