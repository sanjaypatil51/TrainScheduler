//set database config

var config = {
    apiKey: "AIzaSyAhyTxSPD8112Yez11tgNMcizelr1YUOdY",
    authDomain: "class-d282a.firebaseapp.com",
    databaseURL: "https://class-d282a.firebaseio.com",
    projectId: "class-d282a",
    storageBucket: "class-d282a.appspot.com",
    messagingSenderId: "631653290831",
    appId: "1:631653290831:web:1af5b714141ec17310ab3a",
    measurementId: "G-3K1R5SSWYR"
  };

  firebase.initializeApp(config);
  // Create a variable to reference the database
  var database = firebase.database();

//capture event
$("#add-user").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#role-input").val().trim();
    var startTime = $("#date-input").val().trim();
    var frequency = $("#rate-input").val().trim();
    
    
    $("#name-input").val("")
    $("#role-input").val("")
    $("#date-input").val("")
    $("#rate-input").val("")

    database.ref("/train").push({
        trainName: name,
        destination: destination,
        firstTrainTime: startTime,
        frequency: frequency,
        dateadded: firebase.database.ServerValue.TIMESTAMP
      });

      //$(".table").last().append(`<tr><td>${name}</td><td>${role}</td><td>${startDate}</td><td></td><td>${rate}</td></tr>`);


})

 // Firebase watcher + initial loader HINT: .on("value")
 database.ref("/train").on("child_added", function(snapshot) {
    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequency);
    // Change the HTML to reflect

    //var startDate=moment(snapshot.val().startDate)
    //var months=moment().diff(startDate,"months")
    //var totalBilled=(snapshot.val().rate)*months

    $(".table").last().append(`<tr><td>${snapshot.val().trainName}</td><td>${snapshot.val().destination}</td><td>${snapshot.val().frequency}</td><td></td><td></td></tr>`);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });