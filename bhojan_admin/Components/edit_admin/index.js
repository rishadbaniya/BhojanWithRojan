import { IconButton } from '@mui/material';
import {useState, useEffect} from "react";
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { DeleteForever } from '@mui/icons-material';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const getAdmins = (callBack) => {
    window.qt_object.getAdmins();
    window.qt_object.getAdminsResponse.connect((resp)=> {
        callBack(JSON.parse(resp));
    });

}

const deleteAdmin = (username, callBack) => {
    window.qt_object.deleteAdmin(username);
    window.qt_object.getDeleteAdminResponse.connect((resp)=> {
        callBack(resp);
    });
}

const updateAdmin = (username, updated_data) => {

}

export const EditAdmin = ({token}) => {
    const [snackBarState, updateSnackbarState] = useState({
      message: null,
      isOpen: false,
      severity: "error",
    });
    const [allAdmins, updateAdmins] = useState([]);
    const [dialogState, updateDialogState] = useState();
    
    const handleSnackBarClose = () => [
        updateSnackbarState({
            ...snackBarState,
            isOpen : false
        })
    ]

    const onEditClick = (username)=>{

    }

    const onDeleteClick = (username) => {
        updateAdmins([]);
        deleteAdmin(username, (rep) => {
            if(rep === "OK"){
                updateSnackbarState({
                    isOpen : true,
                    severity : "success",
                    message : `The admin ${username} was deleted!`
                })
            }else{
                updateSnackbarState({
                    isOpen : true,
                    severity : "success",
                    message : `Err ${rep}`
                })
            }
        });
        getAdmins((admins) => updateAdmins(admins));
    }

    useEffect(() => {
        getAdmins((admins) => updateAdmins(admins));
    }, []);

   return <>
    <Snackbar
      open={snackBarState.isOpen}
      onClose={handleSnackBarClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <MuiAlert severity={snackBarState.severity} variant="filled"> {snackBarState.message} </MuiAlert>
    </Snackbar>
    <Dialog>

    </Dialog>
   <div className="page_detail">
        <div className="page_detail_header">Edit Admins</div>
        {
            allAdmins.length === 0 ? <div style={{width : "100%", display: "flex", justifyContent : "center"}}><CircularProgress/></div> :
            allAdmins.map((data, index) => {
            return (<Admin full_name={"ABC"} key={index} username={data.username} index={index} onEditClick={onEditClick} onDeleteClick={onDeleteClick}/>)
        })
        }
   </div>
   </>
}

const Admin = ({full_name, username, onEditClick, index, onDeleteClick}) => {
   return <div className="editAdmin__admin">
    <div className="editAdmin_admin_full_name_numbering">
        <div className="editAdmin__admin_numbering">{index}</div>
        <div className="editAdmin__admin_full_name">Full Name : {full_name}</div>
        <div className="editAdmin__admin_username">Username : {username}</div>
    </div>
    <div style={{}}>
    <IconButton aria-label="upload picture" component="label" onClick={() => onEditClick(username)}>
        <CreateIcon />
      </IconButton>
    <IconButton aria-label="upload picture" component="label" onClick={() => onDeleteClick(username)}>
        <DeleteForever />
      </IconButton>
    </div>
    
   </div> 
}