// UserInputs is a global variable to store user inputs as an array

var userInputs = JSON.parse(localStorage.getItem("userInputs")) || Array.from({ length: 9 }, () => '');

// The first thing that was required was to show the correct current date on top of the page, I implemented a function to do so, saving the current day in a variable using the dayjs and format function to format the date as required

function displayCurrentDay() {
  var currentDay = dayjs().format('dddd, MMMM D, YYYY');
  $("#currentDay").text(currentDay);
}

// The following function creates all the time blocks where that shows the hours, the input field and the save button. To do that I created a for loop that runs through the hours index and defines the specific classes for each div, I also included the function to reload the user input from the global array when the page is loaded.

function createTimeBlocks() {
    for (var hour = 9; hour <= 17; hour++) {
      var timeBlock = $("<div>").addClass("row time-block");
      var hourCol = $("<div>")
        .addClass("col-md-1 hour")
        .text(dayjs().hour(hour).format("hA"));
      var textAreaCol = $("<textarea>")
        .addClass("col-md-10 description")
        .attr("data-hour", hour)
        .attr("idDescription", "event" + hour); 
      var saveBtnCol = $("<button>")
        .addClass("col-md-1 saveBtn")
        .html('<i class="fas fa-save"></i>');
  
      timeBlock.append(hourCol, textAreaCol, saveBtnCol);
      $(".container").append(timeBlock);
  
      // Load user input from global array
      textAreaCol.val(userInputs[hour - 9]);
    }
  }
  
// Function to color-code timeblocks based on past, present, and future
function updateHourStyles() {
    var currentHour = dayjs().hour();

    $(".time-block").each(function () {
        var hourBlock = parseInt($(this).attr("data-hour"));

        if (hourBlock < currentHour) {
            $(this).removeClass("present future").addClass("past");
        } else if (hourBlock === currentHour) {
            $(this).removeClass("past future").addClass("present");
        } else {
            $(this).removeClass("past present").addClass("future");
        }
    });
}

// The following function saves the input from the user in the local storage
function saveEvent(hour, event) {
  userInputs[hour - 9] = event; // Update the global array
  console.log("Data inserted into userInputs at index", hour - 9, ":", event);

  // Save userInputs array to local storage
  localStorage.setItem("userInputs", JSON.stringify(userInputs));

  var savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || {};
  savedEvents["event" + hour] = event;
  localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
}

// This is the event listener for the save button click

$(".container").on("click", ".saveBtn", function () {
  var hour = $(this).siblings(".description").attr("data-hour");
  var event = $(this).siblings(".description").val();
  console.log("Received input:", event);
  saveEvent(hour, event);
  loadEvents(); // Load events after saving
});

// This is the function to load events from local storage by reading from the userInputs array in local storage

function loadEvents() {
    var savedEvents = JSON.parse(localStorage.getItem("userInputs")) || {};
    $(".time-block").each(function () {
    var hourBlock = $(this).attr("data-hour");
    var savedEvent = savedEvents[hourBlock - 9] || "";

    if (savedEvent) {
      $(this).find("textarea").val(savedEvent);
    }
  });
}

displayCurrentDay();
createTimeBlocks();
updateHourStyles();
loadEvents(); 

// Periodically update the styles (every minute in this example)
setInterval(function() {
    updateHourStyles();
}, 60000); // 60000 milliseconds = 1 minute
