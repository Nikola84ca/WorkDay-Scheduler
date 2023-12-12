function displayCurrentDay() {
    var currentDay = dayjs().format('dddd, MMMM D, YYYY');
    $("#currentDay").text(currentDay);
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
  
  // Function to save event to local storage
  function saveEvent(hour, event) {
    var savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || {};
    savedEvents["event" + hour] = event;
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }
  
  // Event listener for save button click
  $(".container").on("click", ".saveBtn", function () {
    var hour = $(this).siblings(".description").attr("data-hour");
    var event = $(this).siblings(".description").val();
    console.log("Received input:", event);
    saveEvent(hour, event);
    loadEvents(); // Load events after saving
  });
  
  // Function to load events from local storage
  function loadEvents() {
    var savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || {};
  
    $(".time-block").each(function () {
      var hourBlock = $(this).attr("data-hour");
      var savedEvent = savedEvents["event" + hourBlock] || "";
  
      if (savedEvent) {
        $(this).find("textarea").val(savedEvent);
      }
    });
  }
  
  // Function to create time blocks
  function createTimeBlocks() {
    for (var hour = 9; hour <= 17; hour++) {
      var timeBlock = $("<div>").addClass("row time-block");
      var hourCol = $("<div>")
        .addClass("col-md-1 hour")
        .text(dayjs().hour(hour).format("hA"));
      var textAreaCol = $("<textarea>")
        .addClass("col-md-10 description")
        .attr("data-hour", hour)
        .attr("id", "event" + hour); // Add a unique id here
      var saveBtnCol = $("<button>")
        .addClass("col-md-1 saveBtn")
        .html('<i class="fas fa-save"></i>');
  
      timeBlock.append(hourCol, textAreaCol, saveBtnCol);
      $(".container").append(timeBlock);
    }
  }
  
  // Call the functions in the desired order
  displayCurrentDay();
  createTimeBlocks();
  updateHourStyles();
  loadEvents();
  