# School Show Ticket Tracking + Redeem
A JavaScript/Google Apps Script integrated spreadsheet with ability to search entered show tickets and track their useage.

## What problem is it solving?
I was approached by the Arts Department asking for a way to place barcodes on student show tickets for tracking and to prevent double useage.

## The Process
In its initial state, the ticker holder's information must be manually typed in specified columns on the spreadsheet. When ready to make use during a show, a dropdown button must first be clicked at the top, titled "Ticket Tools" followed by a button titled *Ticket Redeem*.

![Ticket Tools Button](https://i.imgur.com/r0oqfYI.png)

After *Ticket Redeem* is clicked a dialog box will open allowing a user to scan or type the ticket number.

![Ticket Redeem Dialog Box](https://i.imgur.com/6eFmn7u.png)

At this point all the user has to do is type or scan the barcode. If a scanner is used it will automatically press the submit button. I've designed the code to allow the user to press enter to submit if typing (or scanning) the code. This auto-submit process will save lots of time when scanning hundreds of audience members for a show.

After a ticket is scanned it will present one of several messages like *Ticket Redeemed*, *Ticket Already Redeemed* or *No Ticket Found*.

![Ticket Redeemed Message](https://i.imgur.com/NZ7uKyS.png)

![Ticket Already Redeemed Message](https://i.imgur.com/YgjUnn4.png)

![Ticket Not Found Message](https://i.imgur.com/0hQWaCa.png)

These useful messages will inform the user the status of the ticket. Only the *Ticket Redeemed* route will execute code to modify the Google Sheet. Behind the scenes the code is grabbing the ticket number and checking for three (3) things, one if it exists in the *Ticket Number* column, two if it is duplicated within the *Ticket Number* column and finally if it has already been redeemed by checking for an empty or null value in the *Date Redeemed* column.

Upon searching and finding the ticket, the search function is returning a ticket object which has information like it's status, A1 cell location and an array of ticket holder names and locations found by index.

```javascript
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
  ```

The duplicate search is especially useful as it will inform the user of the multiple locations where it has found tickets.

![Duplicate Found Message](https://i.imgur.com/sPZB73r.png)

Provided there are no errors or duplicates, the code's main function is to take that ticket number and write the date and time it is redeemed while preventing it's use a second time.

![Redeemed Columns](https://i.imgur.com/n1THb50.png)

## NOTES

### Development
This JavaScript/Google Apps Script code was deployed within the Google Sheet Internal Script Editor.

#### Future
* Add ability to input/activate tickets via dialog box which will prevent duplicates
