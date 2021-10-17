const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SUN = 0; const MON = 1; const TUE = 2; const WED = 3;
const THU = 4; const FRI = 5; const SAT = 6;

const JAN = 0;  const FEB = 1;  const MAR = 2;
const APR = 3;  const MAY = 4;  const JUN = 5;
const JUL = 6;  const AUG = 7;  const SEP = 8;
const OCT = 9;  const NOV = 10; const DEC = 11;

// Hard coded for now.
// To do: Create tools to apply custom roster
let allStartDates = [
  new Date(2021, JAN, 8),
  new Date(2021, JAN, 13),
  new Date(2021, JAN, 18),
  new Date(2021, JAN, 3)];
let rosterIndex = 0;

function changeRoster() {
  rosterIndex = (rosterIndex+1)%allStartDates.length;
  newCalendar();
}

let date = new Date();
date.setDate(1); //1st of this month
let month = date.getMonth();
let year = date.getFullYear();


// Put all the html into the webpage
$(window).on("load", function() {
  newCalendar();
});

function newCalendar() {
  $("#calendar #grid").html(calendarHTML());
  drawDays();
  applyRoster();
}

function applyRoster() {
  roster = [5, 5, 10];
  rosterLength = 20;

  let ptr = allStartDates[rosterIndex];
  // all: 3-1-21, 8-1-21, 13-1-21, 18-1-21
  let next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);
  
  while (next<date) {
    ptr = next;
    next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);
    console.log(next+"\n"+date);
  }

  // fix this. Calculates too much, only applies to this month
  for (let i=0; i<4; i++) {
    // hard-coded 5 days, 5 nights, 10 off

    for (let day=0; day<5; day++) {
      if (ptr.getMonth()===month) {
        getDateRef(ptr.getDate()).addClass("dayshift");
      }
      ptr.setDate(ptr.getDate()+1);
    }
    for (let day=0; day<5; day++) {
      if (ptr.getMonth()===month) {
        getDateRef(ptr.getDate()).addClass("nightshift");
      }
      ptr.setDate(ptr.getDate()+1);
    }
    ptr.setDate(ptr.getDate()+10);
  }

}



/*******************************************************/
/*********** The bones of the calendar below ***********/
/*******************************************************/

function getDateRef(date) {
  date--; // array index
  let dayOfFirst = (new Date(year, month)).getDay();;
  let daysInMonth = 32 - new Date(year, month, 32).getDate();

  let week = Math.trunc((date+dayOfFirst)/7);
  let day = (date+dayOfFirst)%7;
  return $("#week"+week+" #"+daysOfWeek[day]);

}

function drawDays() {
  $("#calendar #monthAndYear").html(months[month]+" "+year);

  let dayOfFirst = (new Date(year, month)).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();
  
  for (let i=0; i<daysInMonth; i++) {
    let week = Math.trunc((i+dayOfFirst)/7);
    let day = (i+dayOfFirst)%7;
    $("#week"+week+" #"+daysOfWeek[day]).html( i+1 );

  }
}

function previousMonth() {
  if (month === JAN) {
    year--;
    month = DEC;
  } else {
    month--;
  }
  date = new Date(year, month);
  newCalendar();
}

function nextMonth() {
  if (month === DEC) {
    year++;
    month = JAN;
  } else {
    month++;
  }
  date = new Date(year, month);
  newCalendar();
}

function calendarHTML() {
  let calendar = '';

    for (let i=0; i<6; i++) {
      calendar += '<tr id="week'+i+'">';
      for (let j=0; j<7; j++) {
        calendar += '<td id="'+daysOfWeek[j]+'"></td>'
      }
      calendar += "</tr>";
    }
    return calendar;
}


