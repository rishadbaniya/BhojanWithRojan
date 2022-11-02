import {useState} from 'react';
import {AddAdmin} from '../Components/add_admin/index'
import {EditAdmin} from '../Components/edit_admin/index';
import {EditStaff} from '../Components/edit_staff/index';


// token => The token used to make network request after a admin as logged in
// username => The username fo the user that is logged in
const PageButtonClicked = (index, token, username) => {
  switch(index) {
    case 0:
      return <AddAdmin/>;
      break;
    case 1:
      return <EditAdmin/>;
      break;
    case 2:
      return <__AddUser/>;
      break;
    case 3:
      return <__EditUser/>;
      break;
    case 4:
      return <__AddStaff/>;
      break;
    case 5:
      return <EditStaff username={username} token={token}/>;
      break;
    case 6:
      return <__AddEditFood/>;
      break;
    default : 
      return <h1>Help me god</h1>;
  }
}

const __EditAdmin = () => {
  return <>
    </>
}

const __AddUser  = () => {
  return <>
    </>
}
const __EditUser  = () => {
  return <>
    </>
}
const __AddStaff  = () => {
  return <>
    </>
}
const __EditStaff  = () => {
  return <>
    </>
}
const __AddEditFood  = () => {
  return <>
    </>
}

// By Default the Admin is gonna be presented with the Edit User i.e the index 3,
// because we believe that most of the times, the Admin is ever going to login is in order to add balance to the Users
const Admin = ({token, username}) => {
  const [pageIndex, changePageIndex] = useState(3);
  return <>
      <div className="page_buttons_wrapper">
        {
          username === "sudo" ?
          <>
            <PageButton index={0} currentIndex={pageIndex} onClick={() => changePageIndex(0)}>Add Admin</PageButton>
            <PageButton index={1} currentIndex={pageIndex} onClick={() => changePageIndex(1)}>Edit Admin</PageButton>
          </> : <></>
        } 
        <PageButton index={2} currentIndex={pageIndex} onClick={() => changePageIndex(2)}>Add User</PageButton>
        <PageButton index={3} currentIndex={pageIndex} onClick={() => changePageIndex(3)}>Edit User</PageButton>
        <PageButton index={4} currentIndex={pageIndex} onClick={() => changePageIndex(4)}>Add Staff</PageButton>
        <PageButton index={5} currentIndex={pageIndex} onClick={() => changePageIndex(5)}>Edit Staff</PageButton>
        <PageButton index={6} currentIndex={pageIndex} onClick={() => changePageIndex(6)}>Add/Edit Food</PageButton>
      </div>
    <div className="page_button_page_wrapper">{PageButtonClicked(pageIndex, token, username)}</div>
    </>
};



const PAGE_BUTTON = {
  INACTIVE : {
    "background" : "linear-gradient(145deg, #f0f0f0, #cacaca)",
    "boxShadow" : "5px 5px 10px #797979, -5px -5px 10px #ffffff"
  },

  ACTIVE : {
    "background" : "#e0e0e0",
    "boxShadow" : "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
   }
}

const PageButton = (props) => {
  return <>
    <div className="page_button" 
         onClick={props.onClick} 
         style={props.index === props.currentIndex ? PAGE_BUTTON.ACTIVE : PAGE_BUTTON.INACTIVE}>{props.children}
    </div>
  </>
}

export default Admin;


