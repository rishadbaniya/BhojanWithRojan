import {useState} from 'react';
import { Dialog } from "@mui/material";
import Button from "@mui/material/Button";
import QRCode from "react-qr-code";


const UserInfo = ({current_balance, full_name, department, id, image_url}) => {
    const [transactionDialogState, updateTransactionDialogState] = useState(false);
    const [dailyUsageDialogState, updateDailyUsageDialogState] = useState(false);
    const [transferBalanceDialogState, updateTransferDialogBalanceState] = useState(false);

    const closeAllDialog = () => {
        updateDailyUsageDialogState(false)
        updateTransferDialogBalanceState(false);
        updateTransactionDialogState(false);

    }

    const handleTransactionDialog = () => updateTransactionDialogState(true);
    const handleDailyUsageDialogState = () => updateDailyUsageDialogState(true);
    const handleTransferDialogState = () => updateTransferDialogBalanceState(true);


    return <div className="user_info">
        <img src={image_url}/>
        <TransactionHistoryDialog open={transactionDialogState} onClose={closeAllDialog}/>
        <Button className="transaction_history_button" variant="contained" color="success" onClick={handleTransactionDialog}>Transaction History</Button>
        <Button className="daily_usage_button" variant="contained" color="success" onClick={handleDailyUsageDialogState}>Daily Usage</Button>
        <Button className="transfer_balance_button" variant="contained" color="error" onClick={handleTransferDialogState}>Transfer Balance</Button>
    </div>
}

const TransactionHistoryDialog = ({open, onClose, url}) => {
    return <Dialog open={open} onClose={onClose}>
        <div style={{height : "450px", width : "500px", display : "flex", justifyContent: "center", alignItems : "center"}}>
            <div>
                <QRCode size={300} value="https://www.google.com/whatisgoingonherethefilwhswhere" />
            </div>
        </div>
        <div style={{display : "flex", justifyContent: "center", paddingBottom : "16px", fontSize : "22px"}}>Scan And Download Your Transaction History</div>
    </Dialog>
}

const DailyUsageDialog = ({open, onClose}) => {
    return <Dialog open={open} onClose={onClose}>
        <div style={{height : "450px", width : "500px", display : "flex", justifyContent: "center", alignItems : "center"}}>
            <div>
                <QRCode size={300} value="https://www.google.com/whatisgoingonherethefilwhswhere" />
            </div>
        </div>
        <div style={{display : "flex", justifyContent: "center", paddingBottom : "16px", fontSize : "22px"}}>Scan And Download Your Transaction History</div>
    </Dialog>
}

export default UserInfo;