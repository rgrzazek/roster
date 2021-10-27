const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SUN = 0; const MON = 1; const TUE = 2; const WED = 3;
const THU = 4; const FRI = 5; const SAT = 6;

const JAN = 0;  const FEB = 1;  const MAR = 2;
const APR = 3;  const MAY = 4;  const JUN = 5;
const JUL = 6;  const AUG = 7;  const SEP = 8;
const OCT = 9;  const NOV = 10; const DEC = 11;

// Hard coded roster dates. Can be any date that coincides
// with the roster, these dates are not special.
let allStartDates = [
  new Date(2021, OCT, 11),
  new Date(2021, OCT, 16),
  new Date(2021, OCT, 21),
  new Date(2021, OCT, 26)];
let crew = ["A crew", "B crew", "C crew", "D crew"];
let rosterIndex = 0;

function changeRoster() {
  rosterIndex = (rosterIndex+1)%allStartDates.length;
  newCalendar();
}

// default month and year to match today's date
let startOfMonth = new Date();
startOfMonth.setDate(1);
let month = startOfMonth.getMonth();
let year = startOfMonth.getFullYear();
let startOfNext = new Date(year, month+1);


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

  $("#calendar #crew").html(crew[rosterIndex]);

  let ptr = allStartDates[rosterIndex];
  let next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);

  // walk back: start at or before this calendar month
  while (ptr>startOfMonth) {
    ptr = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()-rosterLength);
  }
  // walk forward: start a period that covers the first of this month
  while (next<startOfMonth) {
    ptr = next;
    next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);
  }

  // Calculate whole cycles, repeat until cycle passes end of month
  // rely on fact that adding days will auto-change month
  while (ptr<startOfNext) {
    // 5 days
    for (let day=0; day<5; day++) {
      if (ptr.getMonth()===month) {
        getDateRef(ptr.getDate()).addClass("dayshift");
      }
      ptr.setDate(ptr.getDate()+1);
    }
    // 5 nights
    for (let day=0; day<5; day++) {
      if (ptr.getMonth()===month) {
        getDateRef(ptr.getDate()).addClass("nightshift");
      }
      ptr.setDate(ptr.getDate()+1);
    }
    // 10 days off
    ptr.setDate(ptr.getDate()+10);
  }

}


function getDateRef(date) {
  date--; // look for 0-based array index
  let dayOfFirst = (new Date(year, month)).getDay();;
//  let daysInMonth = 32 - new Date(year, month, 32).getDate();

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
  startOfMonth = new Date(year, month);
  startOfNext = new Date(year, month+1);
  newCalendar();
}

function nextMonth() {
  if (month === DEC) {
    year++;
    month = JAN;
  } else {
    month++;
  }
  startOfMonth = new Date(year, month);
  startOfNext = new Date(year, month+1);
  newCalendar();
}

function calendarHTML() {
  let calendar = '';

    // for example, Wednesday the 6th, in the second calendar week:
    // cells will have row id: "week2" and cell id "Wed" 
    for (let i=0; i<6; i++) {
      calendar += '<tr id="week'+i+'">';
      for (let j=0; j<7; j++) {
        calendar += '<td id="'+daysOfWeek[j]+'">&nbsp</td>'
      }
      calendar += "</tr>";
    }
    return calendar;
}


