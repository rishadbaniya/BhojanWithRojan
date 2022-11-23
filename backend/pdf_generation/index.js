const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

const PDF_DIR = './pdf';
const PORT = 8001;
const APP = express();

/* The request comes in following JSON Schema
 *
 * {
 *      "id" : 1  // ID of the user
 *      "transactionHistory" : [] or [{
 *          "operation" : BALANCE_IN // Represents the type of operation, can have values of BALANCE_IN, TRANSFER_IN, TRANSFER_OUT, PURCHASE
 *          "items" : [
 *          ], // PURCHASE items, [] in case of BALANCE_IN, TRANSFER_IN, TRANSFER_OUT
 *          "rates" : [
 *          ], // PURCHASE rates, [] in case of BALANCE_IN, TRANSFER_IN, TRANSFER_OUT
 *          "quantities" : [
 *          ], // PURCHASE rates, [] in case of BALANCE_IN, TRANSFER_IN, TRANSFER_OUT
 *          "totals" : [
 *          ], // PURCHASE rates, [] in case of BALANCE_IN, TRANSFER_IN, TRANSFER_OUT
 *          date : "2022-10-21"
 *          total_amount : 10 // Total amount of TRANSACTION (+) for increase and (-) for decrease
 *      },...]
 * }
 *
 */


const generateHtml = (data) => {

  let allRows = "";
  data.map((d, i) => {
    if(d.transaction === "BUY"){
      allRows += TRANSACTION.BUY(d);
    }else if(d.transaction === "TRANSFER_IN"){
      allRows += TRANSACTION.TRANSFER_IN(d);
    }else if(d.transaction === "TRANSFER_OUT"){
      allRows += TRANSACTION.TRANSFER_OUT(d);
    }
  });


    const HTML = String.raw`<html>
          <style>
          html {
                -webkit-print-color-adjust: exact;
            }
            table { 
              	width: 750px; 
                border-collapse: collapse; 
	            margin:50px auto;
	         }
             th{ 
	            background: #3498db; 
	            color: white; 
	            font-weight: bold; 
                text-align : center;
	         }
            td{
              text-align : center;
            }
            .in{
              background-color : #A3F4A3;
            }

            .out{
               background-color : #FEADAD;
            }
td, th { 
	padding: 10px; 
	border: 1px solid #ccc; 
	text-align: left; 
	font-size: 10px;
}

 .bill_table {
    width: 100% !important;
		border-collapse: collapse;
		margin: 0px !important;
  }
          </style>
          <body>
          <table>
              <tr> 
                <th>Transaction</th>
                <th>Date</th>
                <th>Bill</th>
                <th>Balance Before</th>
                <th>Balance After</th>
              </tr>
              ${allRows}
          </table>
          </body>
      </html>`;
  return HTML;
}

// It returns a table row
const TRANSACTION = {
  BUY : (data) => {
    let date = new Date(0);
    date.setUTCSeconds(parseInt(data.date));
    date = date.toLocaleString();
      
    const bill = JSON.parse(data.bill);
    let billRows = "";
    bill.map((_d) => {
      billRows += String.raw`
         <tr>
           <td>${_d.item}</td>
           <td>${_d.rate}</td>
           <td>${_d.quantity}</td>
           <td>${_d.amount}</td>
         </tr>
      `;
    });

    const tableRow = String.raw`
      <tr class="out"> 
        <td>BUY</td>
        <td>${date}</td>
        <td>
          <table class="bill_table">
              <tr>
                <th>Item</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
              ${billRows}
        </table>
        </td>
        <td>${data.balance_before}</td>
        <td>${data.balance_after}</td>
      </tr>
    `;
    return tableRow;
  },

  TRANSFER_IN : (data) => {

    let date = new Date(0);
    date.setUTCSeconds(parseInt(data.date));
    date = date.toLocaleString();

    const tableRow = String.raw`
      <tr class="in"> 
        <td>TRANSFER_IN</td>
        <td>${date}</td>
        <td>${data.bill}</td>
        <td>${data.balance_before}</td>
        <td>${data.balance_after}</td>
      </tr>
    `;
    return tableRow;
  },
  TRANSFER_OUT : (data) => {

    let date = new Date(0);
    date.setUTCSeconds(parseInt(data.date));
    date = date.toLocaleString();

    const tableRow = String.raw`
      <tr class="out"> 
        <td>TRANSFER_OUT</td>
        <td>${date}</td>
        <td>${data.bill}</td>
        <td>${data.balance_before}</td>
        <td>${data.balance_after}</td>
      </tr>
    `;
    return tableRow;

  },
};

(async function runBrowser(){
    if (!fs.existsSync(PDF_DIR)){
        fs.mkdirSync(PDF_DIR);
    }

    APP.use(bodyParser.text({
      verify: (req, res, buf) => {
        req.rawBody = buf
      }
    }));

    APP.use(express.static('pdf'))
    APP.post("/", (req, res) => {
      const body = req.body;
      let id = body.substr(0, body.indexOf('{'));
      id = parseInt(id);
      let transactionHistory = `[${body.substr(body.indexOf('{'))}]`;
      try{
        transactionHistory = JSON.parse(transactionHistory);
        let html = generateHtml(transactionHistory);
        (async() => {
          // Had to open and close browser continuosly in every request, kinda tedious...
          // gotta recommend to create once instance and then create multiple pages of it
          let BROWSER = await puppeteer.launch({ headless: true });
          let page = await BROWSER.newPage();
          await page.setContent(html)
          await page.pdf({ path: `pdf/${id}_transaction_history.pdf`, format: 'A4' });
          await BROWSER.close();
          res.send("OK");
        })();
      }catch(e){
        res.send("ERR");
      }

    });

  APP.listen(PORT);
})();


