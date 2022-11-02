import {useState, useEffect} from 'react';
import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

const getAdminsData = () => {
   // qt_object.
   // return data;
}

export const EditStaff = ({token, username}) => {
    const [isDataLoaded, updateIsDataLoaded] = useState(false);
    const [dialogState, updateDialogState] = useState({
        isOpen : false, // State, whether the dialog is open or close
        data : null // Data, of the user to be edited
    });
    const onDialogClose = () => updateDialogState({
        ...dialogState,
        isOpen : false
    });

    const onEditClick = (username)=>{
        updateDialogState({
            ...dialogState,
            isOpen : true
        });
    }

    useEffect(()=>{

    },[]);

 //  <Dialog open={dialogState.isOpen} onClose={onDialogClose}>
 //  
 //  </Dialog>
   return <>
      
   <div className="page_detail">
        <div className="page_detail_header">Edit Staffs</div>
        <Admin full_name="Rishad Baniya" username="rishadbaniya" onEditClick={onEditClick}/>
        <Admin full_name="Rishad Baniya" username="sudo" onEditClick={onEditClick}/>
   </div>
   </>
}

const Admin = ({full_name, username, onEditClick}) => {
   return <div className="editAdmin__admin">
    <div className="editAdmin_admin_full_name_numbering">
        <div className="editAdmin__admin_numbering">1</div>
        <div className="editAdmin__admin_full_name">Full Name : {full_name}</div>
        <div className="editAdmin__admin_username">Username : {username}</div>
    </div>
    <IconButton aria-label="upload picture" component="label" onClick={() => onEditClick(username)}>
        <CreateIcon />
      </IconButton>
   </div> 
}