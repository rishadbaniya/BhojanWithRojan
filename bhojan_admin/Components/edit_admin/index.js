import IconButton from '@mui/material/IconButton';
import {useState, useEffect} from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const getAdmins = (callBack) => {
    window.qt_object.getAdmins();
    window.qt_object.getAdminsResponse.connect((resp)=> {
        console.log(resp);
        callBack(JSON.parse(resp));
    });

}

const deleteAdmin = (username, callBack) => {
    window.qt_object.deleteAdmin(username);
    window.qt_object.getDeleteAdminResponse.connect((resp)=> {
        console.log(resp);
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
        deleteAdmin(username, (rep) => {
            console.log(rep);
            if(rep === "OK"){
                updateSnackbarState({
                    isOpen : true,
                    severity : "success",
                    message : `The admin ${username} was deleted!`
                })
            }else{
                updateSnackbarState({
                    isOpen : true,
                    severity : "error",
                    message : `Err ${rep}`
                })
            }
        });
        updateAdmins([]);
        setTimeout(() => {
            getAdmins((admins) => updateAdmins(admins));
        }, 500);
        
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
   <div className="page_detail">
        <div className="page_detail_header">Edit Admins</div>
        {
            allAdmins.length === 0 ? <div style={{width : "100%", display: "flex", justifyContent : "center"}}><CircularProgress/></div> :
            allAdmins.map((data, index) => {
            return (<Admin key={index} username={data.username} index={index} onEditClick={onEditClick} onDeleteClick={onDeleteClick}/>)
        })
        }
   </div>
   </>
}

const Admin = ({username, onEditClick, index, onDeleteClick}) => {
   return <div className="editAdmin__admin">
    <div className="editAdmin_admin_full_name_numbering">
        <div className="editAdmin__admin_numbering">{index}</div>
        <div className="editAdmin__admin_username">Username : {username}</div>
    </div>
    <div style={{}}>
    { username === "sudo" ? <></> :
    (<IconButton aria-label="upload picture" component="label" onClick={() => onDeleteClick(username)}>
        <DeleteForeverIcon />
      </IconButton>)  }
    </div>
    
   </div> 
}
