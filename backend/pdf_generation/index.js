/* The request comes in following JSON Schema
 *
 * {
 *      "id" : 1  // ID of the user
 *      "data" : [] or [{
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

const puppeteer = require('puppeteer');
const express = require('express');
const PORT = 9000;
const APP = express();

(async function runBrowser(){
//    let BROWSER = await puppeteer.launch({ headless: true });
//    
//    APP.post("/generate_pdf", (req, res) => {
//
//        req = JSON.parse(req);
//        if (req == []}{
//            html = "<h1> NO TRANSACTIONS </h1>"
//        }else{
//            x = ``;
//        }
//        getPdf(html, BROWSER, id).then(() => {
//            html = ```
//
//                <html>
//                    <body>
//                        <table style="border:1px white">
//                        	<tr>
//                        		<th>S.no</th>
//                        		<th>Acitivties</th>
//                        		<th>Item</th>
//                              	<th>Rate</th>
//                              	<th>Quantity</th>
//                        		<th>Amount</th>
//                          	</tr>
//                        	<tr>
//                        		<th>1</th>
//                        		<th>Tranfer out</th>
//                        		<th>-</th>
//                        		<th>-</th>
//                        		<th>-</th>
//                        		<th>2000</th>
//                        	</tr>
//                          	
//                        </table>
//                    </body>
//                </html>
//            ```
//        });
//    });
//    APP.listen(PORT);
})();

(async function getPdf(htmlContent, browser, id, datas){
    let BROWSER = await puppeteer.launch({ headless: true });
          let html = String.raw`
                <html>
                    <style>${STYLE}</style>
                    <body>
                    <table>
                        ${TABLE_HEADING} 
                    <tbody>
                        ${generateTableRows(datas)}
                    </tbody>
                    </table>
                    </body>
                </html>
            `;
  const page = await BROWSER.newPage();
  await page.setContent(html);
  await page.pdf({ path: './abc.pdf', format: 'A4' });
  await BROWSER.close();
})();


const STYLE=String.raw`
html{
    -webkit-print-color-adjust: exact;
}
table { 
	width: 750px; 
	border-collapse: collapse; 
	margin:50px auto;
	}

.in{
    background-color : #A3F4A3;
}

.out{
    background-color : #FEADAD;
}

th { 
	background: #3498db; 
	color: white; 
	font-weight: bold; 
	}

td, th { 
	padding: 10px; 
	border: 1px solid #ccc; 
	text-align: left; 
	font-size: 10px;
	}
`;

const TABLE_HEADING = String.raw`
<thead>
  <tr>
    <th>S.N</th>
    <th>Date</th>
    <th>Operation</th>
    <th>Items</th>
    <th>Rate</th>
    <th>Quantity</th>
    <th>Amount</th>
    <th>Total</th>
  </tr>
</thead>
`;

const generateTableRows = (data) => {
    let ALL_ROWS = "";
    data.map((d) => {
        const {operation, items, rates, quantities, totals, total_amount} = d;
        const IN_OR_OUT = (operation == "BALANCE_IN" || operation == "TANSFER_IN") ? "in" : "out";
        ALL_ROWS += String.raw`
        <tr class="${IN_OR_OUT}">
          <td data-column="SN">James</td>
          <td data-column="Last Name">Matman</td>
          <td data-column="Job Title">Chief Sandwich Eater</td>
          <td data-column="Twitter">@james</td>
        </tr>`
    });
}

/*
 * JSON Data format as req:
 * []
 * Empty array that represents 
 *
 *
 *
 *
 *
 *
 */
