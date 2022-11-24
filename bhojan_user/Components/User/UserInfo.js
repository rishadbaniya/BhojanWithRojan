import React, {useEffect, useState} from 'react';
import { CircularProgress, Dialog, IconButton, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import QRCode from "react-qr-code";
import Slide from '@mui/material/Slide';
import { LineChart } from 'recharts';
import { Tooltip, CartesianGrid, Line, XAxis, YAxis } from 'recharts';
import MuiAlert from "@mui/material/Alert";
import { NumberPad } from '../Login/NumberPad';
import sha256 from 'sha256';

const BACKEND_ADDRESS = "http://10.42.0.1:8001";

const Transition = React.forwardRef(function Transition( props , ref) {
    return <Slide direction="up" ref={ref} {...props} />;
 });

const UserInfo = ({full_name, department, image_url, id, balance, balanceUpdateCallback}) => {
    const TRANSACTION_HISTORY_PDF_NAME = `${id}_transaction_history.pdf`
    const [transactionDialogState, updateTransactionDialogState] = useState(false);
    const [dailyUsageDialogState, updateDailyUsageDialogState] = useState(false);
    const [transferBalanceDialogState, updateTransferDialogBalanceState] = useState(false);
    const [changePasswordDialogState, updateChangePasswordDialogState] = useState(false);

    const closeAllDialog = (callback) => {
        updateDailyUsageDialogState(false)
        updateTransferDialogBalanceState(false);
        updateTransactionDialogState(false);
        updateChangePasswordDialogState(false);
    }

    const updateBalance = (balance) => {
       closeAllDialog() 
       balanceUpdateCallback(balance);
    }

    const handleTransactionDialog = () => updateTransactionDialogState(true);
    const handleDailyUsageDialogState = () => updateDailyUsageDialogState(true);
    const handleTransferDialogState = () => updateTransferDialogBalanceState(true);
    const handleChangePasswordDialogState = () => updateChangePasswordDialogState(true);


    return <div className="user_info">
        <img className="user_info__image" src={image_url}/>
        <div className="user_info__full_name">Name : {full_name}</div>
        <div className="user_info__department">Department : {department}</div>
        <DailyUsageDialog open={dailyUsageDialogState} onClose={closeAllDialog} id={id}/> 
        <TransactionHistoryDialog open={transactionDialogState} onClose={closeAllDialog} file_name={TRANSACTION_HISTORY_PDF_NAME}/>
        <TransferBalanceDialog open={transferBalanceDialogState} onClose={updateBalance} own_id={id} balance={balance}/>
        <ChangePasswordDialog open={changePasswordDialogState} onClose={closeAllDialog} id={id} />
        <Button className="transaction_history_button" variant="contained" color="success" onClick={handleTransactionDialog}>Transaction History</Button>
        <Button className="daily_usage_button" variant="contained" color="success" onClick={handleDailyUsageDialogState}>Daily Usage</Button>
        <Button className="transfer_balance_button" variant="contained" color="error" onClick={handleTransferDialogState}>Transfer Balance</Button>
        <Button className="change_password_button" variant="contained" color="error" onClick={handleChangePasswordDialogState}>Change Password</Button>
    </div>
}

const TransactionHistoryDialog = ({open, onClose, url, file_name}) => {
    const PDF_LOCATION = BACKEND_ADDRESS + "/" + file_name;
    return <Dialog 
                open={open}
                onClose={onClose}>
        <div style={{height : "450px", width : "500px", display : "flex", justifyContent: "center", alignItems : "center"}}>
            <div>
                <QRCode size={300} value={PDF_LOCATION} />
            </div>
        </div>
        <div style={{display : "flex", justifyContent: "center", paddingBottom : "16px", fontSize : "22px"}}>Scan And Download Your Transaction History</div>
    </Dialog>
}
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);
  
    return date.toLocaleString('en-US', {
      month: 'short',
    });
}

const DailyUsageDialog = ({open, onClose, id}) => {
    const [chartData, updateChartData] = useState([]);
    useEffect(() => {
        window.qt_object.getDailyUsage(`${id}`);
        window.qt_object.getDailyUsageResponse.connect((data)=>{
            data = `[${data}]`;
            data = JSON.parse(data);
            data = data.filter((d) => d.transaction === "BUY");
            console.log(data);
            //{
            //   date : "22323",
            //   data : [
            //
            //   ]
            //}
            data = data.map((d, i) => {
               const date = new Date(0);
               date.setUTCSeconds(parseInt(d.date));
               date = `${toMonthName(date.getMonth())}/${date.getDate()}`
                return {
                    ...d,
                    date : date
                }
            });
            
            let allDates = new Set();
            data.map((d) => {
                allDates.add(d.date);
            })
            
            let datesAndAmounts = [];
            Array.from(allDates).map((date) => {
                let totalSpent = 0;
                data.map((d) => {
                    if(d.date === date){
                        let bill = JSON.parse(d.bill);
                        bill.map((_billD) => {
                            totalSpent += _billD.rate * _billD.quantity;
                        });
                    }
                });

                datesAndAmounts.push({
                    name : date,
                    AmountSpent : totalSpent
                })
            })
            updateChartData(datesAndAmounts);
        });
        
    }, []);
    return <>
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullScreen 
        TransitionComponent={Transition}>
        <div className="daily_usage_dialog">
            <div className="close_button_wrapper">
                <Button variant="contained" color="error" onClick={onClose}>Close</Button>
            </div>
            <LineChart style={{margin: "auto"}} width={1900} height={800} data={chartData}>
            <YAxis />
            <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="AmountSpent" stroke="#ff7300" yAxisId={0} />
            </LineChart>
        </div>
        
    </Dialog>
    </>
}

const TransferBalanceDialog = ({open, onClose, balance, own_id}) => {
    const [isSending, updateIsSending] = useState(false);
    const [idState, updateIdState] = useState("");
    const [balanceState, updateBalanceState] = useState("");
    const [isIdFocused, updateIsIdFocused] = useState(true);
    const [isBalanceFocused, updateIsBalanceFocused] = useState(false);
    const [snackBar, updateSnackBar] = useState({
        isOpen : false,
        severity : null,
        message : null
    });

    const resetState = () => {
        updateIsSending(false);
        updateIdState("");
        updateBalanceState("");
        updateIsIdFocused(true);
        updateIsBalanceFocused(false);
    }

    const handleSnackBarClose = () => {
        updateSnackBar({
            ...snackBar,
            isOpen : false
        })
    }

    const onTransferClick = () => {
        if(idState === ""){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : "Please Enter a id to transfer balance to"
            });
        }else if(parseInt(idState) === own_id){
            console.log(parseInt(idState), own_id);
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : `You entered your OWN ID`
            });
        }else if(balanceState === "" || (parseInt(balanceState) > balance) || (parseInt(balanceState) < 0)){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : `Enter amount less than or equal to ${balance}`
            });
        }else{
            updateIsSending(true);
            const sendState = {
                own_id : own_id,
                to_id : parseInt(idState),
                amount : parseInt(balanceState)
            }
            window.qt_object.transferBalance(JSON.stringify(sendState));
            window.qt_object.transferBalanceResponse.connect((d) => {
                try{
                    // Gets object of new balance on success
                    //{
                    //  "balance" : 50
                    //}
                    console.log(d);
                    const resp = JSON.parse(d);
                    updateSnackBar({
                        isOpen : true,
                        severity : "success",
                        message : "Balance successfully transferred"
                    });
                    resetState();
                    onClose(resp.balance);
                }catch{
                    // Gets error text on error
                    updateSnackBar({
                        isOpen : true,
                        severity : "error",
                        message : "Err : " + d
                    });
                }
                updateIsSending(false)
            });
        }
    }
    return <>
    <Dialog
        open={open} 
        onClose={onClose} 
        fullScreen 
        TransitionComponent={Transition}>
        <Snackbar open={snackBar.isOpen} onClose={handleSnackBarClose} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
            <MuiAlert severity={snackBar.severity} variant="filled"> {snackBar.message} </MuiAlert>
        </Snackbar>
            <div className="transfer_balance_dialog">
                <div className='close_button_wrapper'>
                    <IconButton onClick={() => {
                            resetState();
                            onClose(balance)
                        }} size="large">
                        <CloseIcon />
                    </IconButton>

                    <div className="login">
                        <input className="student_input" id="student_input_id" placeholder="Enter Student ID To Transfer" value={idState} onFocus={() => {
                            updateIsIdFocused(true);
                            updateIsBalanceFocused(false);
                        }} />
                        <input className="student_input" id="student_input_password" placeholder= {`Enter amount less than or equal to ${balance}`} value={balanceState} onFocus = {() => {
                            updateIsIdFocused(false);
                            updateIsBalanceFocused(true);
                        }}/>
                        <div 
                         style={{padding : "16px",  position:"absolute", top : "200px" , left: "35%"}} className="login_button_wrapper">
                            {isSending ? <_CircularProgress/> : <Transfer onClick={onTransferClick}/>}
                        </div>
                    </div>
                </div>
            </div>
         <NumberPad state={isIdFocused ? idState : (isBalanceFocused ? balanceState : "" )}
             updateState={isIdFocused ? updateIdState : (isBalanceFocused ? updateBalanceState : () => {})}
         />
         
        </Dialog>
        </>
}

const ChangePasswordDialog = ({open, onClose, id}) =>{
    const [isSending, updateIsSending] = useState(false);
    const [oldPasswordState, updateOldPasswordState] = useState("");
    const [newPasswordState, updateNewPasswordState] = useState("");
    const [isOldFocused, updateIsOldFocused] = useState(true);
    const [isNewFocused, updateIsNewFocused] = useState(false);
    const [snackBar, updateSnackBar] = useState({
        isOpen : false,
        severity : null,
        message : null
    });

    const resetState = () => {
        updateIsSending(false);
        updateNewPasswordState("");
        updateOldPasswordState("");
        updateIsOldFocused(true);
        updateIsNewFocused(true);
    }

    const handleSnackBarClose = () => {
        updateSnackBar({
            ...snackBar,
            isOpen : false
        })
    }

    const onChangeClick = () => {
        if(oldPasswordState === ""){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : "Please enter your old password"
            });
        }else if(newPasswordState === ""){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : "Please enter your new password"
            });
        }else{
            updateIsSending(true);
            const sendState = {
                id : id,
                new_password : sha256(newPasswordState),
                old_password : sha256(oldPasswordState)
            }

            window.qt_object.changePassword(JSON.stringify(sendState));
            window.qt_object.changePasswordResponse.connect((resp) => {
                if(resp === "OK"){
                    updateSnackBar({
                        isOpen : true,
                        severity : "success",
                        message : "Password Successfully Changed!"
                    });
                    resetState();
                    onClose();
                }else{
                    updateSnackBar({
                        isOpen : true,
                        severity : "error",
                        message : "Err : " + resp
                    });
                }
                updateIsSending(false)
            });
        }
    }

    return <>
    <Snackbar open={snackBar.isOpen} onClose={handleSnackBarClose} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
            <MuiAlert severity={snackBar.severity} variant="filled"> {snackBar.message} </MuiAlert>
    </Snackbar>
    <Dialog
        open={open} 
        onClose={onClose} 
        fullScreen 
        TransitionComponent={Transition}>
        
            <div className="transfer_balance_dialog">
                <div className='close_button_wrapper'>
                    <IconButton onClick={() => {
                            resetState();
                            onClose();
                    }} size="large">
                        <CloseIcon />
                    </IconButton>

                    <div className="login">
                        <input className="student_input" id="student_input_id" placeholder="Enter old password" value={oldPasswordState} onFocus={() => {
                            updateIsOldFocused(true);
                            updateIsNewFocused(false);
                        }} />
                        <input className="student_input" id="student_input_password" placeholder="Enter new password" value={newPasswordState} onFocus = {() => {
                            updateIsOldFocused(false);
                            updateIsNewFocused(true);
                        }}/>
                        <div 
                         style={{padding : "16px",  position:"absolute", top : "200px" , left: "35%"}} className="login_button_wrapper">
                            {isSending ? <_CircularProgress/> : <ChangePassword onClick={onChangeClick}/>}
                        </div>
                    </div>
                </div>
            </div>
         <NumberPad state={isOldFocused ? oldPasswordState : (isNewFocused ? newPasswordState : "" )}
             updateState={isOldFocused ? updateOldPasswordState : (isNewFocused ? updateNewPasswordState : () => {})}
         />
         
        </Dialog>
        </>
}

const _CircularProgress = () => {
    return <div style={{display : "flex", justifyContent : "center"}}>
            <CircularProgress />
        </div>
}


const ChangePassword = ({onClick}) => {
    return <Button variant="contained" className="login_button" onClick={onClick}>Change Password</Button>
}

const Transfer = ({onClick}) => {
    return <Button variant="contained" className="login_button" onClick={onClick}>Transfer</Button>
}
export default UserInfo;
