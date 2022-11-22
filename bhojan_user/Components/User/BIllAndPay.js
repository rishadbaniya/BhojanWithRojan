import Button from "@mui/material/Button";
import Chip from '@mui/material/Chip';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {useState} from 'react';

// currentBalance => The current Balance fo the user. Eg 1000
// itemsSelected => Array of object that represents food items Eg [{
//    item : "Samosa",
//    rate : 20,
//    quantity : 2,
//    amount : 40,
//  }]
// onPayClick => A callback function to be called when the "Pay" button is clicked
// onClearClick => A callback function to be called when the "Clear" button is clicked
// where itemsSelected is an array of object with keys "item", "rate", "amount", "quantity"
const BillAndPay = ({currentBalance, itemsSelected, onPayClick, onExitClick}) => {
    const [snackBarState, updateSnackBarState]  = useState({
        isOpen : false,
        severity : "",
        message : ""
    });
   const [netBalance, updateNetBalance] = useState(currentBalance);
   const onSnackClose = () => {
        updateSnackBarState({
            ...snackBarState,
            isOpen : false
        })
   }

   return (
   <>
    <Snackbar open={snackBarState.isOpen} onClose={onSnackClose} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} >
          <MuiAlert severity={snackBarState.severity} variant="filled">{snackBarState.message}</MuiAlert>
     </Snackbar>

    <div className="bill_and_pay">
        <div>
            <div className='bill_heading'>Your Bill</div>
            <hr />
                <BillTable itemsSelected={itemsSelected}/>
            <hr />
        </div>
        <div>
            <BalanceDetail currentBalance={currentBalance} itemsSelected={itemsSelected} updateNetBalance={updateNetBalance}/>
            <div className="button_exit_pay">
                <Button color="error" className="button_exit" variant="contained" onClick={onExitClick}>Exit</Button>
                <Button color="success" className="button_pay" variant="contained" onClick={() => {
                    if(netBalance < 0){
                        updateSnackBarState({
                            isOpen : true,
                            severity : "error",
                            message : "You can't buy this much"
                        })
                    }else{
                        onPayClick();
                    }
                    
                }}>Pay</Button>
            </div>
        </div>
    </div>
   </>
   );
}

const BalanceDetail = ({currentBalance, itemsSelected, updateNetBalance}) => {
    const total = 0;
    itemsSelected.map((d) =>{
        total += d.rate * d.quantity;
    });
    const netBalance = currentBalance - total;
    updateNetBalance(netBalance);

    return <div className="balance_detail_wrapper"> 
        <div className="balance_detail">Your Current Balance =  <Chip color="success" className="total_amount" label={currentBalance}/></div>
        <div className="balance_detail">Your Net Balance =  <Chip color="error" className="total_amount" label={netBalance}/></div>
        <div className="balance_detail">Your Total =  <Chip color="success" className="total_amount" label={total}/></div>
    </div>
}

const BillTable = ({itemsSelected}) =>{
    console.log(itemsSelected);
    return <div className='bill_table'>
        <div className='bill_item'>
            <div className="bill_table_heading">Item</div>
            <hr />
            {itemsSelected.map((data, index) => {
                return <div className="bill_table_member" key={index}>{data.item}</div>
            })}
        </div>
        <div className='bill_rate'>
            <div className="bill_table_heading">Rate</div>
            <hr />
            {itemsSelected.map((data, index) => {
                return <div className="bill_table_member" key={index}>{data.rate}</div>
            })}
        </div>
        <div className='bill_quantity'>
            <div className="bill_table_heading">Quantity</div>
            <hr />
            {itemsSelected.map((data, index) => {
                return <div className="bill_table_member" key={index}>{data.quantity}</div>
            })}
        </div>
        <div className='bill_amount'>
            <div className="bill_table_heading">Amount</div>
            <hr />
            {itemsSelected.map((data, index) => {
                return <div className="bill_table_member" key={index}>{data.amount * data.quantity}</div>
            })}
        </div>
    </div>
}

const BillButton = ({onPay, onClear}) =>{

}

export default BillAndPay;
