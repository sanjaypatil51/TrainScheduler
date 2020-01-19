var trainNumber = 0

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
  trainNumber++

  $("#name-input").val("")
  $("#role-input").val("")
  $("#date-input").val("")
  $("#rate-input").val("")

  database.ref("/train").push({
    trainName: name,
    destination: destination,
    firstTrainTime: startTime,
    frequency: frequency,
    trainId: trainNumber,
    dateadded: firebase.database.ServerValue.TIMESTAMP
  });

  //$(".table").last().append(`<tr><td>${name}</td><td>${role}</td><td>${startDate}</td><td></td><td>${rate}</td></tr>`);


})

// Firebase watcher + initial loader HINT: .on("value")
database.ref("/train").on("child_added", function (snapshot) {
  // Log everything that's coming out of snapshot
  console.log(snapshot.val());
  console.log(snapshot.val().trainName);
  console.log(snapshot.val().destination);
  console.log(snapshot.val().firstTrainTime);
  console.log(snapshot.val().frequency);
  // Change the HTML to reflect

  var tFrequency = snapshot.val().frequency

  // 
  var firstTime = snapshot.val().firstTrainTime

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log("firstconverted " + firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  $(".table").last().append(`<tr class=nr><td class=editable contenteditable='true'>${snapshot.val().trainName}</td>
    <td class=editable contenteditable='true'>${snapshot.val().destination}</td>
    <td>${snapshot.val().frequency}</td><td>${nextTrain}</td>
    <td>${tMinutesTillTrain}</td>
    <td><button disabled id=${snapshot.val().trainId} class="btn btn-primary updateSch">Update</button></td>
    <td><button class="btn btn-primary deleteSch">Delete</button></td>
    <td id=trainId style=display:none>${snapshot.val().trainId}</td></tr>`);
  trainNumber = snapshot.val().trainId
  console.log("current train number: " + trainNumber)
  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


function removeTrainSchedule(id) {
  console.log("TrainId" + id)
  var queryRef = database.ref("/train").orderByChild("trainId").equalTo(parseInt(id));


  queryRef.once('value', function (snapshot) {
    console.log(snapshot.val())
    snapshot.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val().readingId;
      console.log(childKey + " " + childData)
      database.ref("/train").child(childKey).remove();
    })
  })

}


//update train schedule

function updateTrainSchedule(name, destination, frequency, trainNum) {
  var queryRef = database.ref("/train").orderByChild("trainId").equalTo(parseInt(trainNum));


  queryRef.once('value', function (snapshot) {
    console.log(snapshot.val())
    snapshot.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val().readingId;
      console.log(childKey + " " + childData)
      database.ref("/train").child(childKey).update({

        trainName: name,
        destination: destination,
        frequency: frequency,
        dateaUpdated: firebase.database.ServerValue.TIMESTAMP

      })


    })
  })
}


//delete schedule after button press
$(".table").on("click", ".deleteSch", function (event) {
  //getting all rows exmple
  //row=$(".table .deleteSch")
  //console.log("?????"+row[0].parentNode.parentNode.cells[0].innerHTML)
  var trainNum = $(this)[0].parentNode.parentNode.cells[7].innerHTML
  removeTrainSchedule(trainNum)
  $(this)[0].parentNode.parentNode.remove()

  //anotehr wau to select row and columns for that row
  //var row = $(this).closest("tr"),        // Finds the closest row <tr> 
  //tds = row.find("td"); // find all tds for tr
  //console.log(row)

  // $.each($(tds), function () {               // Visits every single <td> element
  //console.log("----" + $(this).text());        // Prints out the text within the <td>
  //});

  //update databse and remove train

})

//update schedule
$(".table").on("click", ".updateSch", function (event) {
  //getting all rows exmple
  //row=$(".table .deleteSch")
  //console.log("?????"+row[0].parentNode.parentNode.cells[0].innerHTML)
  var trainNum = $(this)[0].parentNode.parentNode.cells[7].innerHTML
  var name = $(this)[0].parentNode.parentNode.cells[0].innerHTML
  var destination = $(this)[0].parentNode.parentNode.cells[1].innerHTML
  var frequency = $(this)[0].parentNode.parentNode.cells[2].innerHTML
  $("#"+trainNum).prop("disabled", true)
  console.log('train num -----' + trainNum)
  updateTrainSchedule(name, destination, frequency, trainNum)

})

//enable update button on updating row cell, use dynamic id associated with button
$(".table").on("click", ".editable", function (event) {
  console.log("in editable event")
  var row = $(this)[0].parentNode.cells[7].innerHTML
  $("#"+row).prop("disabled", false)


  //console.log($(this)[0].parentNode.cells[5].innerHTML)


})

