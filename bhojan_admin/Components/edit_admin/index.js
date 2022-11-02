import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

export const EditAdmin = ({token}) => {
    const onEditClick = (username)=>{
    }
   return <>
   <div className="page_detail">
        <div className="page_detail_header">Edit Admins</div>
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