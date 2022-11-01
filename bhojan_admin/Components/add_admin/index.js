import { useState } from "react";
import ImageUploading from 'react-images-uploading';
import styled from 'styled-components';

export const AddAdmin = () => {
  const [currentState, updateState] = useState({
    full_name : "",
    username : "",
    email : "",
    password : "",
    confirm_password : "",
    gender : "",
    DOB : {
        month : 0,
        day : 0,
        year : 0
    },
  });
 const [images, setImages] = useState([]);

  const onEnterFullNameChange = (event) => {
    updateState({
      ...currentState,
      full_name : event.target.value
    });
  }

  const onEnterUsernameChange = (event) => {
    updateState({
      ...currentState,
      username : event.target.value
    });
  }

  const onEnterEmailChange = (event) => {
    updateState({
      ...currentState,
      email : event.target.value
    });
  }

  const onEnterPasswordChange = (event) => {
    updateState({
      ...currentState,
      password : event.target.value
    });
  }

  const onEnterConfirmPasswordChange = (event) => {
    updateState({
      ...currentState,
      confirm_password : event.target.value
    });

 }
 
 const onChange = (imageList, addUpdateIndex) => {
   console.log(imageList, addUpdateIndex);
   setImages(imageList);
 };

 const onSubmit = () => {
    let toSubmitState = {
        ...currentState,
        image_data : images[0].data_url,
        file_name : images[0].file.name
    };
    console.log(toSubmitState);
 }

  return <>
    
    <div className="page_detail">
      <div className="page_detail_header">Add Admin</div>
      <div className="enter_full_name" placeholder="Enter Full Name (Eg. Rishad Baniya)" onChange={onEnterFullNameChange}/>
      <EnterUserNameEmail placeholder="Enter username (Eg. rishadbaniya)" onChange={onEnterUsernameChange}/>
      <EnterUserNameEmail placeholder="Enter email (Eg. xyz@gmail.com)" onChange={onEnterUsernameChange}/>
      <EnterPassword type="password" placeholder="Enter Your Password" onChange={onEnterPasswordChange}/>
      <ConfirmPassword type="password" placeholder="Confirm Your Password" onChange={onEnterConfirmPasswordChange}/>
      <WrapperMaleFemaleWrapper>
      <MaleFemaleWrapper>
        <Gender type="radio" value="Male" name="gender"/>
        <span style={{marginLeft : "4px"}}>Male</span>
      </MaleFemaleWrapper>
      <MaleFemaleWrapper>
        <Gender type="radio" value="Male" name="gender"/>
        <span style={{marginLeft : "4px"}}>Female</span>
      </MaleFemaleWrapper>
      </WrapperMaleFemaleWrapper>
      <EnterDOB>Enter Date Of Birth :</EnterDOB>
        <InputYear placeholder="Year" type="number"/>
        <InputMonth placeholder="Month" type="number"/>
        <InputDay placeholder="Day"type="number"/>
     <ImageUploading
       value={images}
       onChange={onChange}
       maxNumber={10}
       dataURLKey="data_url"
       acceptType={["jpg", "png"]}
      >
        {({
            imageList,
            onImageUpload,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
        }) => (
          // write your building UI
          <div>
            <button
            className="upload_image"
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}>Click Or Drop To Upload Image </button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <UpdateRemove onClick={() => onImageUpdate(index)}>Update</UpdateRemove>
                  <UpdateRemove onClick={() => onImageRemove(index)}>Remove</UpdateRemove>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    <button className="submit" onClick={onSubmit}>Submit</button>
    </div>
    </>
}

const UpdateRemove = styled.button`
  margin-top : 8px;
  font-family : 'Ubuntu', sans-serif;
  font-size : 12px;
  padding : 4px;
  cursor : pointer;

`;
const EnterUserNameEmail = styled.input`
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


const WrapperMaleFemaleWrapper = styled.div`
  display : flex;
`;

const MaleFemaleWrapper = styled.div`
  padding: 16px 8px 8px 8px;
  display : inline-block;
  font-family : 'Ubuntu', sans-serif;
  font-size : 16px;
`;

const Gender = styled.input`
  display:inline-block;
`
const InputYear = styled.input`
  margin-top : 16x;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 10%;
`;

const InputMonth = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 8%;
`;

const InputDay = styled.input`
  margin-top : 16px;
  border: 0;
  outline: 0;
  font-size : 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius : 8px;
  width : 8%;
`;

const EnterDOB = styled.div`
  font-weight : bold;
  padding-top : 16px;
  padding-bottom : 16px;
  font-size : 18px;
  font-family : 'Ubuntu', sans-serif;
`;