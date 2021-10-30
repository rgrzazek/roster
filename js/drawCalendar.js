const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SUN = 0; const MON = 1; const TUE = 2; const WED = 3;
const THU = 4; const FRI = 5; const SAT = 6;

const JAN = 0;  const FEB = 1;  const MAR = 2;
const APR = 3;  const MAY = 4;  const JUN = 5;
const JUL = 6;  const AUG = 7;  const SEP = 8;
const OCT = 9;  const NOV = 10; const DEC = 11;

const DAY = 0;
const NIGHT = 1;
const BREAK = 2;

/*
 * Hard coded values, set up any roster by changing the following 
 * variables. Note that roster is calculated forward and back, any
 * valid dates for the start of a roster cycle will work.
 * 
 * - roster [ [Type (Day/night/break), length of block], ... ]
 * - allStartDates & crewLabels (same length)
 * 
 * The roster cycle can be any length
 * "allStartDates" corresponds to "crewLabels"
 */
const roster = [ [DAY, 5], [NIGHT, 5], [BREAK, 10] ];
let rosterLength=0;
roster.forEach(block => {
  rosterLength += block[1];
});

// Hard coded roster dates. Code will calculate forward or back
let allStartDates = [
  new Date(2021, OCT, 12),
  new Date(2021, OCT, 17),
  new Date(2021, OCT, 22),
  new Date(2021, OCT, 27)];
let crewLabels = ["A crew", "B crew", "C crew", "D crew"];
let rosterIndex = 0;
/******************** End customising code ********************/

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
  // year and month already refer to calendar date
  startOfMonth = new Date(year, month);
  startOfNext = new Date(year, month+1);

  $("#calendar #grid").html(calendarHTML());
  drawDays();
  applyRoster();
}

function applyRoster() {

  $("#calendar #crew").html(crewLabels[rosterIndex]);

  let ptr = allStartDates[rosterIndex];
  let next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);

  // walk back: start at or before this calendar month
  while (ptr>startOfMonth) {
    ptr = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()-rosterLength);
  }
  // walk forward: start at a period that covers the first of this month
  while (next<startOfMonth) {
    ptr = next;
    next = new Date(ptr.getFullYear(), ptr.getMonth(), ptr.getDate()+rosterLength);
  }

  // Calculate roster cycles, repeat until cycle passes end of month
  while (ptr<startOfNext) {
    roster.forEach(block => {
      for (let day=0; day<block[1]; day++) {
        if (ptr.getMonth()===month) {
          switch (block[0]) {
            case DAY: getDateRef(ptr.getDate()).addClass("dayshift");
                      break;
            case NIGHT: getDateRef(ptr.getDate()).addClass("nightshift");
                        break;
          }
        }
        ptr.setDate(ptr.getDate()+1);
      }
    });
  }
}

// find dom object for the cell <td> of the table
function getDateRef(date) {
  date--; // look for 0-based array index
  let dayOfFirst = (new Date(year, month)).getDay();;

  let week = Math.trunc((date+dayOfFirst)/7); // div
  let day = (date+dayOfFirst)%7; // mod
  return $("#week"+week+" #"+daysOfWeek[day]);
}

function calendarHTML() {
  let calendar = '';
    // all months have 6 rows regardless
    for (let i=0; i<6; i++) {
      calendar += '<tr id="week'+i+'">';
      for (let j=0; j<7; j++) {
        calendar += '<td id="'+daysOfWeek[j]+'">&nbsp</td>'
      }
      calendar += "</tr>";
    }
    return calendar;
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
  if (month === JAN) {year--;}
  month = (month===JAN)?DEC:month-1;
  newCalendar();
}

function nextMonth() {
  if (month === DEC) {year++;}
  month = (month===DEC)?JAN:month+1;
  newCalendar();
}
