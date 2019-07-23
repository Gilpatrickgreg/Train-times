$(document).ready(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyD4WjHsZovoiwhKXN9ATBxPDvI3t2w3h5k",
    authDomain: "train-times-f2642.firebaseapp.com",
    databaseURL: "https://train-times-f2642.firebaseio.com",
    projectId: "train-times-f2642",
    storageBucket: "",
    messagingSenderId: "835719234112",
    appId: "1:835719234112:web:4d17613c158bddcc"
  };
  //Initialize Firebase here and store in variable mydatabase
  firebase.initializeApp(firebaseConfig);
  var mydatabase = firebase.database();
  //Event listner for input data to be sent to my database
  $("#submit").on("click", function(event){
    event.preventDefault();
    //variables that are storing user input data
    var trainName = $("#trainInput1").val().trim();
    var destination = $("#destination1").val().trim();
    var firstTrainTime = moment().format($("#trainTime1").val().trim(), "HH:mm");
    var frequency = parseInt($("#frequency1").val().trim());
    
    //variable to store key and value (Json)
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    };
    //pushing to my database to store data
    mydatabase.ref().push(newTrain);
    //clearing input fields making them empty
     $("#trainInput1").val("");
     $("#destination1").val("");
     $("#trainTime1").val("");
     $("#frequency1").val("");
    
    });
    
    mydatabase.ref().on("child_added", function(childSnapshot){
    //Acessing the data on firebase
      var dataTrainName = childSnapshot.val().trainName;
      var dataTrainDestination = childSnapshot.val().destination;
      var dataFrequency = childSnapshot.val().frequency;
      var firstTrainTime = childSnapshot.val().firstTrainTime; 
      
    //This takes my data and does the math on train times and next train arrival stores in variables
      var diffbetweenpresentandfirsttrain = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes");
      var remainder = diffbetweenpresentandfirsttrain % dataFrequency;
      var mintillnextarrival = dataFrequency-remainder;
      var nextarrivaltime = moment().add(mintillnextarrival, 'minutes');
      var formattedarrival = moment(nextarrivaltime).format("HH:mm");
    //This creates new rows from the data coming back from firebase and appends it to page
      var newRow = $("<tr>").append(
        $("<td>").text(dataTrainName),
        $("<td>").text(dataTrainDestination),
        $("<td>").text(dataFrequency),
        $("<td>").text(formattedarrival),
        $("<td>").text(mintillnextarrival),
      );
        $("#trainTable > tbody").append(newRow)
    
      
      })
    
  });