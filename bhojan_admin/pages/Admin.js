import {useState} from 'react';
import styled from 'styled-components';

const PageButtonClicked = (index) => {
  switch(index) {
    case 0:
      return <__AddAdmin/>;
      break;
    case 1:
      return <__EditAdmin/>;
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
      return <__EditStaff/>;
      break;
    case 6:
      return <__AddEditFood/>;
      break;
    default : 
      return <h1>Help me god</h1>;
  }
}

const PageDetail = styled.div`
  padding : 16px;
  display : flex;
  flex-direction : column;
  border-radius : 16px;
  height : 80vh;
  width : 60vw;
  position : absolute;
  left : 50%;
  bottom: 50%;
  transform: translate(-50%,50%);
  border-radius : 16px;
  box-shadow:  5px 5px 10px #797979, -5px -5px 10px #ffffff;
`;

const PageDetailHeader = styled.div`
  font-size : 24px;
  font-family : 'Ubuntu', sans-serif;
  font-weight : bold;
  padding : 0px 0px 16px 0px;
  width : 100%;
  text-align : center;
`;

const EnterFullName = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 50%;
`;
const EnterUserName = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 50%;
`;
const EnterPassword = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 40%;
`;
const ConfirmPassword = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 40%;
`;

// All the pages for the PageButton 
//
const __AddAdmin = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Add Admin</PageDetailHeader>
      <EnterFullName placeholder="Enter Full Name (Eg. Rishad Baniya)"></EnterFullName>
      <EnterPassword type="password" placeholder="Enter Your Password"/>
      <ConfirmPassword type="password" placeholder="Confirm Your Password"/>
      <div>
        <input type="radio" value="Male" name="gender"/>
        <p>Male</p>
      </div>
      <div>
      <input type="radio" value="Female" name="gender"/>
      </div>
    </PageDetail>
    </>
}


const __EditAdmin = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Edit Admin</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}

const __AddUser  = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Add User</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}
const __EditUser  = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Edit User</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}
const __AddStaff  = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Add Staff</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}
const __EditStaff  = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Edit Staff</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}
const __AddEditFood  = () => {
  return <>
    <PageDetail>
      <PageDetailHeader>Add/Edit Food</PageDetailHeader>
      <input></input>
    </PageDetail>
    </>
}

// By Defaul the Admin is gonna be presented with the Edit User i.e the index 3,
// because we believe that most of the times, the Admin is ever going to login is in ordert to add balance to the Users
const Admin = () => {
  const [pageIndex, changePageIndex] = useState(3);
  return <>
      <div className="page_buttons_wrapper">
        <PageButton index={0} currentIndex={pageIndex} onClick={() => changePageIndex(0)}>Add Admin</PageButton>
        <PageButton index={1} currentIndex={pageIndex} onClick={() => changePageIndex(1)}>Edit Admin</PageButton>
        <PageButton index={2} currentIndex={pageIndex} onClick={() => changePageIndex(2)}>Add User</PageButton>
        <PageButton index={3} currentIndex={pageIndex} onClick={() => changePageIndex(3)}>Edit User</PageButton>
        <PageButton index={4} currentIndex={pageIndex} onClick={() => changePageIndex(4)}>Add Staff</PageButton>
        <PageButton index={5} currentIndex={pageIndex} onClick={() => changePageIndex(5)}>Edit Staff</PageButton>
        <PageButton index={6} currentIndex={pageIndex} onClick={() => changePageIndex(6)}>Add/Edit Food</PageButton>
      </div>
    <div className="page_button_page_wrapper">{PageButtonClicked(pageIndex)}</div>
    </>
};






// TODO : Use Styled Component to manage theme 

const PAGE_BUTTON = {
  INACTIVE : {
    "background" : "linear-gradient(145deg, #f0f0f0, #cacaca)",
    "box-shadow" : "5px 5px 10px #797979, -5px -5px 10px #ffffff"
  },

  ACTIVE : {
    "background" : "#e0e0e0",
    "box-shadow" : "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
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





//
export default Admin;


