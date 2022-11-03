import { IconButton } from '@mui/material';
import {useState, useEffect} from "react";
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { DeleteForever } from '@mui/icons-material';

export const EditAdmin = ({token}) => {
    const [allAdmins, updateAdmins] = useState([]);

    const onEditClick = (username)=>{

    }

    useEffect(() => {
        console.log(qt_object);
        window.qt_object.getAdmins();
        window.qt_object.getAdminsResponse.connect((resp)=> {
            updateAdmins(JSON.parse(resp));
        });
    }, []);

   return <>
   <div className="page_detail">
        <div className="page_detail_header">Edit Admins</div>
        {
            allAdmins.length === 0 ? <div style={{width : "100%", display: "flex", justifyContent : "center"}}><CircularProgress/></div> :
            allAdmins.map((data, index) => {
            return (<Admin full_name={"ABC"} key={index} username={data.username} index={index} onEditClick={onEditClick}/>)
        })
        }
   </div>
   </>
}

const Admin = ({full_name, username, onEditClick, index}) => {
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
    <IconButton aria-label="upload picture" component="label" onClick={() => onEditClick(username)}>
        <DeleteForever />
      </IconButton>
    </div>
    
   </div> 
}