import IconButton from '@mui/material/IconButton';
import {useState, useEffect, useRef} from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Dialog } from '@mui/material';

const getUsers = (callBack) => {
    window.qt_object.getUsers();
    window.qt_object.getUsersResponse.connect((resp)=> {
        console.log(resp);
        callBack(JSON.parse(resp));
    });

}

const deleteUser = (id, callBack) => {
    window.qt_object.deleteUser(id);
    window.qt_object.deleteUserResponse.connect((resp)=> {
        console.log(resp);
        callBack(resp);
    });
}

const editUser = (data, callback) => {
    window.qt_object.editUserBalance(data);
    window.qt_object.editUserBalanceResponse.connect((resp) => {
        callback(resp);
    });

}

const updateAdmin = (username, updated_data) => {

}

export const EditUser = ({token}) => {
    const [snackBarState, updateSnackbarState] = useState({
      message: null,
      isOpen: false,
      severity: "error",
    });
    const [allUsers, updateUsers] = useState([]);
    const [dialogState, updateDialogState] = useState({
        isOpen : false,
        id :null 
    });
    
    const handleSnackBarClose = () => [
        updateSnackbarState({
            ...snackBarState,
            isOpen : false
        })
    ]

    const onEditClick = (id, balance)=>{
        updateDialogState({
            isOpen : true,
            id : id,
            balance : balance
        });
    }

    const handleDialogClose = () => {
        updateDialogState({
            ...dialogState,
            isOpen : false
        })
    }

    const updateBalance = (id, newBalance) => {
        if(newBalance <= dialogState.balance || isNaN(newBalance)) {
            updateSnackbarState({
                isOpen : true,
                severity : "error",
                message : `The balance added should be greater than 0`
            });
        }else{
            const data = `${id},${dialogState.balance},${newBalance}`;
            handleDialogClose();
            editUser(data, (resp) => {
              if(resp == "OK"){
                    updateSnackbarState({
                        isOpen : true,
                        severity : "success",
                        message : `The balance was updated successfully`
                    });
                    getUsers((admins) => updateUsers(admins));
              }else{
                    updateSnackbarState({
                        isOpen : true,
                        severity : "error",
                        message : `Err : ${resp}`
                    });
              }
              
              
            });
        }
        

    }

    const onDeleteClick = (id) => {
        deleteUser(id, (rep) => {
            console.log(rep);
            if(rep === "OK"){
                updateSnackbarState({
                    isOpen : true,
                    severity : "success",
                    message : `The user with ${id} was deleted!`
                })
            }else{
                updateSnackbarState({
                    isOpen : true,
                    severity : "error",
                    message : `Err ${rep}`
                })
            }
        });
        updateUsers([]);
        setTimeout(() => {
            getUsers((admins) => updateUsers(admins));
        }, 500);
        
    }
    const balanceInput = useRef();
    useEffect(() => {
        getUsers((admins) => updateUsers(admins));
    }, []);

   return <>
   <Dialog open={dialogState.isOpen} onClose={handleDialogClose}>
        <div style={{padding : "16px", display : "flex", flexDirection : "column"}}>
            <input type="number" placeholder="Add amount" style={{fontSize : "24px", padding : "8px"}} ref={balanceInput}></input>
            <Button variant="contained" color="success" style={{borderRadius : "16px", textTransform : "none",marginTop : "8px", fontSize : "18px"}} onClick={() => updateBalance(dialogState.id, parseInt(dialogState.balance) + parseInt(balanceInput.current.value))}>Add</Button>
        </div>
   </Dialog>
    <Snackbar
      open={snackBarState.isOpen}
      onClose={handleSnackBarClose}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <MuiAlert severity={snackBarState.severity} variant="filled"> {snackBarState.message} </MuiAlert>
    </Snackbar>
   <div className="page_detail">
        <div className="page_detail_header">Edit Users</div>
        {
            allUsers.map((data, index) => {
            return (<User full_name={data.full_name} key={index} id={data.id} index={index} onEditClick={onEditClick} onDeleteClick={onDeleteClick} balance={data.balance}/>)
        })
        }
   </div>
   </>
}

const User = ({full_name, id, onEditClick, index, onDeleteClick, balance}) => {
   return <div className="editAdmin__admin">
    <div className="editAdmin_admin_full_name_numbering">
        <div className="editAdmin__admin_numbering">{index}</div>
        <div className="editAdmin__admin_full_name">Full Name : {full_name}</div>
        <div className="editAdmin__admin_username">ID : {id}</div>
        <div className="editAdmin__admin_username">Balance : {balance}</div>
    </div>
    <div style={{}}>
    <IconButton aria-label="upload picture" component="label" onClick={() => onEditClick(id, balance)}>
        <CreateIcon />
      </IconButton>
      <IconButton aria-label="upload picture" component="label" onClick={() => onDeleteClick(id)}>
        <DeleteForeverIcon />
      </IconButton> 
    </div>
    
   </div> 
}