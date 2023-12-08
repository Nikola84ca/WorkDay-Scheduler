function displayCurrentDay() {
    var currentDay = dayjs().format('dddd, MMMM D, YYYY');
    $("#currentDay").text(currentDay);
  }
  displayCurrentDay();