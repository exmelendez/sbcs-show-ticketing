var ss = SpreadsheetApp.getActive();
var ticketSheet = ss.getSheetByName("Ticket_Redeem");

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Ticket Tools')
      .addItem('Ticket Redeem', 'ticketRedeemDialog')
      .addToUi();
}

function ticketRedeemDialog() {
  var html = HtmlService.createHtmlOutputFromFile('ticket_redeem')
      .setWidth(300)
      .setHeight(500);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Redeem Ticket');
}

/* TICKET FUNCTIONS BEGIN */
function redeemTix(ticketNum) {
  var ticketSheetData = ticketSheet.getRange(2, 1, ticketSheet.getLastRow(), ticketSheet.getLastColumn()).getValues();
  var ticketObject = tixSearch(ticketNum, ticketSheetData);

  switch (ticketObject.status) {
    case 'no match found':
      return "No Ticket Found";
    case 'already redeemed':
      return "Ticket Already Redeemed";
    case 'match found':
      ticketSheet.getRange(ticketObject.cellLocations[0].row+2, ticketObject.cellLocations[0].col+3).setValue(createTimeStr("date"));
      ticketSheet.getRange(ticketObject.cellLocations[0].row+2, ticketObject.cellLocations[0].col+4).setValue(createTimeStr("time"));
      return "Ticket Redeemed";
    case 'more than one found':
      var msg = "Duplicate tickets found at ";
      for(var i = 0; i < ticketObject.cellLocations.length; i++) {
        if(i == ticketObject.cellLocations.length-1){
          msg += ticketObject.cellLocations[i].A1;
        } else {
          msg += ticketObject.cellLocations[i].A1 + ", ";
        }
      }
      return msg;
    default:
      return "Error";
  }
}

//Searches column for matching ticket numbers and returns object containing ticket location & info.
function tixSearch(ticketNum, sheet) {
  var ticketObject = {
    studentName: [],
    grade: [],
    status: "no match found",
    cellLocations:[]
  };
  var redeemed = false;
  
  for (var i = 0; i < sheet.length; i++){
    if(sheet[i][2] == ticketNum){
      ticketObject.studentName.push(sheet[i][0]);
      ticketObject.grade.push(sheet[i][1]);
      ticketObject.cellLocations.push({
        A1: 'C' + (i+2),
        col: 2,
        row: i
      });
      
      if(sheet[i][4] != "") {
        redeemed = true;
      }
    }
  }

  if(redeemed) {
    ticketObject.status = "already redeemed";
  } else if(ticketObject.cellLocations.length > 1) {
    ticketObject.status = "more than one found";
  } else if(ticketObject.cellLocations.length == 1){
    ticketObject.status = "match found";
  }

  return ticketObject;
}

function createTimeStr(type) {
  var now = new Date();
  var month = String(now.getMonth() + 1);
  var day = String(now.getDate());
  var year = String(now.getFullYear());
  var hour = String(now.getHours());
  var minutes = "";
  
  if(now.getMinutes() < 10) {
    minutes = String('0' + now.getMinutes());
  } else {
    minutes = String(now.getMinutes());
  }
  
  switch (type) {
    case 'date':
      return month + '-' + day + '-' + year;
    case 'time':
      return hour + ':' + minutes;
  }
}

/* TICKET FUNCTIONS END */