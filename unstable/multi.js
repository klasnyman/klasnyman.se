// Multi.js

// Todo:
// Nice style table. Red, yellow, green?
// Export / Send result by mail.
// More options
// Tips: utifrån vilket tal som missas så visas relevanta tips på hur
//       det går att tänka på just detta tal.

// Skriva om koden till läslig.
// Nuvarande fråga som objekt?

//objekt?



"use strict";

/* Meny och Resultattabell */
function openNav1() {
  document.getElementById("myNav1").style.display = "block";
}
function closeNav1() {
  document.getElementById("myNav1").style.display = "none";
}

function openNav2() {
  document.getElementById("myNav2").style.display = "block";
}
function closeNav2() {
  document.getElementById("myNav2").style.display = "none";
}

function openNav3() {
  document.getElementById("myNav3").style.display = "block";
}
function closeNav3() {
  document.getElementById("myNav3").style.display = "none";
}

function openNav4() {
  document.getElementById("myNav4").style.display = "block";
}
function closeNav4() {
  document.getElementById("myNav4").style.display = "none";}

// 2018-05-15 New function replacing HTML.
function createResultTable(table, tableSize) {

  // Create first row of table:
  let row0 = table.insertRow(0);
  let cell00 = row0.insertCell(0);
  cell00.setAttribute("onClick", "changeStatusAll()");
  for (let cols = 1; cols<(tableSize+2);cols++) {
      let cell = row0.insertCell(cols);
      cell.innerHTML = cols - 1;
      cell.setAttribute("onClick", "changeStatusColumn(" + (cols - 1) + ")");
  }

  // Fill rest of tablerows((head), 0 , 1, ... , tableSize)
  for (let rows = 1; rows<(tableSize+2); rows++) {

    // First cell of row
    let row = table.insertRow(rows);
    let firstCell = row.insertCell(0);
    firstCell.innerHTML = rows - 1;
    firstCell.setAttribute("id",("r"+rows));
    firstCell.setAttribute("onClick", "changeStatusRow(" + (rows - 1) + ")");

    // Rest of cells (head, 0 , 1, ... , tableSize)
    for (let cols = 1; cols < (tableSize + 2); cols++ ) {
      let cell = row.insertCell(cols)
      cell.innerHTML = "";
      cell.setAttribute("id",("d"+(rows-1)+"x"+(cols-1)));
      cell.setAttribute("onClick", "changeStatus(" + (rows - 1)  + "," + (cols - 1) + ")");

    }
  }
}


const MULTIPLICATION_MAX = 15; // MUST be 10 or greater.

createResultTable(document.getElementById("tableResultat"), MULTIPLICATION_MAX);

let antalRatt = 0;
let antalFel = 0;
let ratt = matrix(MULTIPLICATION_MAX+1,MULTIPLICATION_MAX+1,0);
let fel = matrix(MULTIPLICATION_MAX+1,MULTIPLICATION_MAX+1,0);
let tidfel = matrix(MULTIPLICATION_MAX+1,MULTIPLICATION_MAX+1,0);
let status = matrix(MULTIPLICATION_MAX+1,MULTIPLICATION_MAX+1,0);
let msgSvar = `V&auml;kommen!`;
let countdown = 4;

const MODE_DISABLED = 0;
const MODE_TIMER = 1;
const MODE_NR = 2;
const MODE_FOREVER = 3;
let mode = MODE_FOREVER;

let modeTotalNr = 0;
let modeCurrentNr = 0;
let modeRattNr = 0;

let modeCurrentTime = 0;
let modeTotalTime = 0;
let modeRattTime = 0;
let modeQuestionsTime = 0;

const ENABLED = 0;
const DISABLED = 1;

let countdownTimeRunning = ENABLED;
let countdownTime = 0;

let multiplikator =  Math.floor((Math.random() * (MULTIPLICATION_MAX+1)));
let multiplikand =  Math.floor((Math.random() * (MULTIPLICATION_MAX+1)));

if (document.cookie != "") {
  if (getCookie("antalRatt") > 0) {
    antalRatt = JSON.parse(getCookie("antalRatt"));
    antalFel = JSON.parse(getCookie("antalFel"));
    ratt = JSON.parse(getCookie("ratt"));
    fel = JSON.parse(getCookie("fel"));
    tidfel = JSON.parse(getCookie("tidfel"));
    status = JSON.parse(getCookie("status"));
    updateScore();
    updateStatus();
  }
}

let toggleMoveOn = 0;

if (getQueryStringValue("mo") == 1) {
  toggleMoveOnF();
} else {
/*  toggleMoveOnF();
  toggleMoveOnF();*/
}
statusTen();
newQuestion();

/*document.getElementById("time").style.opacity = "0";*/
document.getElementById("madeby1").style.visibility = "hidden";
/*document.getElementById("guessText").focus();*/

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function toggleMoveOnF() {
  if (toggleMoveOn == 0) {
    toggleMoveOn = 1;
    document.getElementById("toggleMoveOnText").innerHTML = `Inst&auml;llning: Upprepa fel`;
  } else {
    toggleMoveOn = 0;
    document.getElementById("toggleMoveOnText").innerHTML = `Inst&auml;llning: G&aring; vidare`;
  }
  document.getElementById("guessText").focus();
}

function questionModeNr(nrQuestions) {

  mode = MODE_NR;
  modeRattNr = 0;
  modeTotalNr = nrQuestions;
  modeCurrentNr = 1;
  newQuestion();

  document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
  document.getElementById("rattFel").innerHTML = "Utmaning: " + nrQuestions + " st";
  document.getElementById("guessText").focus();

}

function questionModeForever() {
  mode = MODE_FOREVER;
  newQuestion();
  document.getElementById("rattFel").innerHTML = ""
  document.getElementById("guessText").focus();
  document.querySelector("#question").textContent = "";


}

function questionModeTimer(duration) {
  document.getElementById("guessText").focus();
  if (mode == MODE_TIMER) {
    modeCurrentTime = duration;
    modeRattTime = 0;
    modeQuestionsTime = 0;
  }
  mode = MODE_TIMER;
  modeCurrentTime = duration;
  newQuestion();
  let textOut
  let timerInterval = setInterval(function ()
  {
    if (mode != MODE_TIMER) {
      clearInterval(timerInterval);
    } else {
      textOut = modeCurrentTime < 10 ? "0" + modeCurrentTime : modeCurrentTime;
      document.querySelector("#question").textContent = "Utmaning: " + (textOut-1) + " sekunder";
      document.getElementById("guessText").focus();
      if (--modeCurrentTime < 0) {
        mode = MODE_DISABLED;
        modeCurrentTime = 0;
        document.getElementById("rattFel").innerHTML = 'Utmaningstiden &auml;r slut! Du hade ' + modeRattTime + " r&auml;tt av " + modeQuestionsTime + ".";
        document.getElementById("fraga").style.visibility = "hidden";
        document.getElementById("guessText").style.visibility = "hidden";
        clearInterval(timerInterval);
      }
    }

  }, 1000);

  document.getElementById("rattFel").innerHTML = "Utmaning: " + duration + " sekunder";
}


function countdownTimer(duration, display) {
    countdownTime = duration;
    countdownTimeRunning = ENABLED;
    let seconds;
    setInterval(function () {
        seconds = countdownTime;

        seconds = seconds < 10 ? "0" + seconds : seconds;

/*        display.textContent = "Uppgift: " + seconds + " sekunder";*/

        if (--countdownTime < 0) {
          // Tidfel
          if (countdownTimeRunning == ENABLED) {
//            tidfel[multiplikator][multiplikand] = tidfel[multiplikator][multiplikand] + 1;
            countdownTime = 0; //duration
            countdownTimeRunning = DISABLED;
            document.getElementById("guessText").style.backgroundColor = "LemonChiffon";
            document.getElementById("fraga").style.color = "LemonChiffon";
          } else {
            countdownTime = 0;
          }
        }
    }, 1000);
}


function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = function () {
    countdownTimer(countdown, document.querySelector('#time'));
};


// Växlar om tabllen visas eller ej samt ger guessText fokus
/*function toggleTable() {
  if (document.getElementById("madeby1").style.visibility == "hidden") {
    document.getElementById("madeby1").style.visibility = "visible";
  } else {
    document.getElementById("madeby1").style.visibility = "hidden";
  }
  document.getElementById("guessText").focus();

}
*/

// Slumpar en ny fråga och uppdaterar textfält.
function newQuestion(upprepa = 0) {
  if (mode != MODE_DISABLED){
    document.getElementById("fraga").style.visibility = "visible";
    document.getElementById("guessText").style.visibility = "visible";

    if (upprepa == 0) {
      let i = 0;
      while (i < 300) {
        multiplikator = Math.floor((Math.random() * (MULTIPLICATION_MAX+1)));
        multiplikand = Math.floor((Math.random() * (MULTIPLICATION_MAX+1)));
        if (getStatus(multiplikator, multiplikand) == ENABLED) { break; }
        i++;
      }
    }

    document.getElementById("fraga").innerHTML = `${multiplikator} &middot; ${multiplikand} =`;
    document.getElementById("guessText").value = "";
    document.getElementById("rattFel").innerHTML = `${msgSvar}`;
    document.getElementById("rattTotalt").innerHTML = "Totalt: " + `${antalRatt}` +
      " r&auml;tt av " + `${antalRatt+antalFel}`;

    countdownTime = countdown;
    countdownTimeRunning = ENABLED;
    document.getElementById("guessText").style.backgroundColor = "white";
    document.getElementById("fraga").style.color = "white";


    setCookie("antalRatt", JSON.stringify(antalRatt), 3);
    setCookie("antalFel", JSON.stringify(antalFel), 3);
    setCookie("ratt", JSON.stringify(ratt), 3);
    setCookie("fel", JSON.stringify(fel), 3);
    setCookie("tidfel", JSON.stringify(tidfel), 3);
    setCookie("status", JSON.stringify(status), 3);
  } else {
    // No mode
    document.getElementById("fraga").style.visibility = "hidden";
    document.getElementById("guessText").style.visibility = "hidden";
  }
}

// Skapar en 2D-matris
function matrix (numrows, numcols, initial) {
    let arr = [];
    for (let i = 0; i < numrows; ++i) {
        let columns = [];
        for (let j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

function textChange() {
  let guessText = document.getElementById("guessText").value;
  if (guessText.length >= String(multiplikator*multiplikand).length) {
    guess();
  }
}

// testar om gissning stämmer med frågan, kallar newQuestion och updateScore
function guess()
{
  let guessText = document.getElementById("guessText").value;

  if (guessText == "") {
    return;
  }
  if (mode == MODE_TIMER) {modeQuestionsTime++};

  if (guessText == multiplikator * multiplikand) {
    if (countdownTimeRunning == ENABLED){
      const alternativRatt = [`Korrekt!`,`R&auml;tt!`,`Snyggt!`,`Utm&auml;rkt!`,`Exakt!`,`Bra!`,`Forts&auml;tt s&aring; h&auml;r!`]
      msgSvar = alternativRatt[Math.floor((Math.random() * alternativRatt.length))];
      document.getElementById("rattFel").style.color = "Lavender"
      ratt[multiplikator][multiplikand]=ratt[multiplikator][multiplikand] + 1;
    } else {
      const alternativTid = [`Korrekt`,`R&auml;tt`,`Snyggt`,`Utm&auml;rkt`,`Exakt`,`Bra`,`Forts&auml;tt s&aring; h&auml;r`]
      msgSvar = alternativTid[Math.floor((Math.random() * alternativTid.length))];
      document.getElementById("rattFel").style.color = "LemonChiffon"
      tidfel[multiplikator][multiplikand]=tidfel[multiplikator][multiplikand] + 1;
    }
    antalRatt++;
    if (mode == MODE_TIMER) { modeRattTime++ };
    if (mode == MODE_NR) { modeRattNr++ };
  } else {
    if (toggleMoveOn == 0) {
      msgSvar = `Inte riktigt, &nbsp; ${multiplikator} &middot; ${multiplikand} = ${multiplikator * multiplikand}` ; // Fel svar
    } else {
      msgSvar = `Inte riktigt, f&ouml;rs&ouml;k igen:`
    }
    document.getElementById("rattFel").style.color = "MistyRose"
    antalFel++;
    fel[multiplikator][multiplikand]=fel[multiplikator][multiplikand] + 1;
  }

  if (mode == MODE_NR) {
    modeCurrentNr ++;
    document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
    if (modeCurrentNr > modeTotalNr) {
        mode = MODE_DISABLED;
        modeCurrentNr = modeTotalNr;
        document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
        document.getElementById("rattFel").innerHTML = 'Det var sista fr&aring;gan! Du hade ' + modeRattNr + " r&auml;tt av " + modeTotalNr + ".";
        document.getElementById("fraga").style.visibility = "hidden";
        document.getElementById("guessText").style.visibility = "hidden";
        modeRattNr = 0;
        modeTotalNr = 0;
    } else {
      document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
      if (toggleMoveOn == 1 && guessText != multiplikator * multiplikand) {
        newQuestion(1);
      } else {
        newQuestion(0);
      }
    }
  } else {
    if (toggleMoveOn == 1 && guessText != multiplikator * multiplikand) {
      newQuestion(1);
    } else {
      newQuestion(0);
    }
  }

  updateScore();
  document.getElementById("guessText").focus();

}

//ändrar status om ett visst par ska inkluderas eller ej.
function changeStatus(a,b,newStatus) {
  if (arguments.length == 3) {
    status[a][b]=newStatus;
    if (newStatus == DISABLED && multiplikator == a && multiplikand == b) {
      newQuestion();
    }
  } else {
    status[a][b]=status[a][b]+1;
    if (status[a][b] > 1) {
      status[a][b] = 0;
    }
    if (status[a][b] == DISABLED && multiplikator == a && multiplikand == b) {
      newQuestion();
    }
  }
  updateStatus(a,b);
}

function statusDisabled() {
  for (let j = 0; j<(MULTIPLICATION_MAX+1);++j) {
    for (let i = 0; i<(MULTIPLICATION_MAX+1);++i) {
      changeStatus(i,j,DISABLED);
    }
  }
}

//Status lätta hörnet
function statusEasy() {
  statusDisabled();
  for (let j = 0; j<6;++j) {
    for (let i = 0; i<6;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}

function statusTen() {
  statusDisabled();
  for (let j = 0; j<11;++j) {
    for (let i = 0; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}

function statusLevel1() {
  statusDisabled();
  for (let j = 0; j<6;++j) {
    for (let i = 0; i<6;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (let j = 6; j<11;++j) {
    for (let i = 0; i<3;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (let j = 0; j<3;++j) {
    for (let i = 3; i<(11);++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (let j = 3; j<(11);++j) {
      changeStatus(10,j,ENABLED);
      changeStatus(j,10,ENABLED);
  }
  updateStatus();
}

function statusNumber(numberToBeEnabled) {
  statusDisabled();
  for (let j = 0; j<(11);++j) {
      changeStatus(numberToBeEnabled,j,ENABLED);
      changeStatus(j,numberToBeEnabled,ENABLED);
  }
  msgSvar = ("Tabell " + numberToBeEnabled);
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  updateStatus();
  newQuestion();
}

function statusMedium() {
  statusDisabled();
  for (let j = 0; j<(11);++j) {
    for (let i = 0; i<(11);++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (let j = 6; j<(MULTIPLICATION_MAX+1);++j) {
    for (let i = 6; i<(MULTIPLICATION_MAX+1);++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  msgSvar = "Nivå 1";
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  updateStatus();
  newQuestion();

}

function statusMediumOnly() {
  statusDisabled();
  for (let j = 0; j<(11);++j) {
    for (let i = 0; i<(11);++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (let j = 6; j<(MULTIPLICATION_MAX+1);++j) {
    for (let i = 6; i<(MULTIPLICATION_MAX+1);++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (let j = 0; j<6;++j) {
    for (let i = 0; i<6;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  updateStatus();
}

function statusHard() {
  statusDisabled();
  for (let j = 0; j<(11);++j) {
    for (let i = 0; i<(11);++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  msgSvar = "Nivå 2";
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  updateStatus();
  newQuestion();
}

function statusHardOnly() {
  statusDisabled();
  for (let j = 6; j<(11);++j) {
    for (let i = 6; i<(11);++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  msgSvar = "Nivå 3";
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  updateStatus();
  newQuestion();
}

function statusSvaraHornet() {
  statusDisabled();
  for (let j = 6; j<10;++j) {
    for (let i = 6; i<10;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}

function statusRemoveGreen() {
  for (let j = 0; j < (MULTIPLICATION_MAX+1); j++) {
    for (let i = 0; i < (MULTIPLICATION_MAX+1); i++) {
      if (fel[j][i] == 0 && ratt[j][i]>0) {
        changeStatus(j,i,DISABLED) ;
      } else if ((ratt[j][i]+tidfel[j][i])>(fel[j][i] + 2))
      changeStatus(j,i,DISABLED) ;
    }
  }
  updateStatus();
}

function changeStatusRow(a) {
  for (let i = 0; i<(MULTIPLICATION_MAX+1);++i) {
    changeStatus(a,i);
  }
  updateStatus();
}

function changeStatusColumn(b) {
  for (let i = 0; i<(MULTIPLICATION_MAX+1);++i) {
    changeStatus(i,b);
  }
  updateStatus();
}

function changeStatusAll() {
  for (let j = 0; j<(MULTIPLICATION_MAX+1);++j) {
    for (let i = 0; i<(MULTIPLICATION_MAX+1);++i) {
      changeStatus(i,j);
    }
  }
  updateStatus();
}

function getStatus(a,b) {
  return status[a][b];
}

// Uppdaterar hur tabellen med resultat ser ut
function updateStatus(j,i) {
  if (arguments.length == 0) {
    for (let j = 0; j < (MULTIPLICATION_MAX+1); j++) {
      for (let i = 0; i < (MULTIPLICATION_MAX+1); i++) {
        if (status[j][i] == ENABLED) {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "white";
        } else {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgrey";
        }
      }
    }
  } else {
    if (status[j][i] == ENABLED) {
      document.getElementById("d"+j+"x"+i).style.backgroundColor = "white";
    } else {
      document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgrey";
    }
  }
  document.getElementById("guessText").focus();
}


// uppdaterar innehållet i tabllen (poängräkningen)
function updateScore() {
  for (let j = 0; j < (MULTIPLICATION_MAX+1); j++) {
    for (let i = 0; i < (MULTIPLICATION_MAX+1); i++) {
      if (ratt[j][i] + tidfel[j][i] + fel[j][i] == 0) {
        document.getElementById("d"+j+"x"+i).innerHTML = "";
      } else {
        document.getElementById("d"+j+"x"+i).innerHTML =
        ratt[j][i] + "/" + tidfel[j][i] + "/" + fel[j][i];
        if (fel[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.color = "darkgreen";
        } else if (ratt[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.color = "red";
        } else {
          document.getElementById("d"+j+"x"+i).style.color = "black";
        }
      }
    }
  }
}

//Nollställer poängräkningen och kör updateScore()
function resetScore() {
  for (let j = 0; j < (MULTIPLICATION_MAX+1); j++) {
    for (let i = 0; i < (MULTIPLICATION_MAX+1); i++) {
      fel[i][j] = 0;
      tidfel[i][j] = 0;
      ratt[i][j] = 0;
    }
  }
  antalFel = 0;
  antalRatt = 0;
  updateStatus();
  updateScore();
  document.getElementById("rattTotalt").innerHTML = "";
  document.getElementById("guessText").focus();

}
