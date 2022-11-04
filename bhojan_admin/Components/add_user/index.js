import { useState } from "react";
import ImageUploading from "react-images-uploading";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import sha256 from "sha256";
import LinearProgress from "@mui/material/LinearProgress";

const FULL_NAME_PLACEHOLDER = "Enter user's full name (Eg. Rishad Baniya)";
const ID_PLACEHOLDER = "Enter user's ID Number(Eg. 2569)";
const PASSWORD_PLACEHOLDER = "Enter password for the user";

const validateState = (state) => {
  if (state.full_name === null) {
    return "Full Name Field Is Empty";
  } else if (state.id === null) {
    return "ID Number field is empty";
  } else if (state.password === null) {
    return "Enter a numeric password";
  } else if (state.gender === null) {
    return "Choose a gender";
  } else {
    return "OK";
  }
};

const EmptyState = {
    full_name: null,
    id: null,
    password: null,
    gender: null,
    balance : 0,
};

export const AddUser = () => {
  const [snackBarState, updateSnackbarState] = useState({
    message: null,
    isOpen: false,
    severity: "error",
  });

  const [currentState, updateState] = useState(EmptyState);  // Entire state of Admin
  const [isAdminBeingAdded, updateIsAdminBeingAdded] = useState(false);
  const [images, setImages] = useState([]);

  const handleSnackBarClose = () => {
    updateSnackbarState({
      ...snackBarState,
      isOpen: false,
    });
  };

  const onEnterFullNameChange = (event) => {
    updateState({
      ...currentState,
      full_name: event.target.value,
    });
  };

  const onEnterIDChange = (event) => {
    updateState({
      ...currentState,
      id : event.target.value,
    });
  };


  const onEnterPasswordChange = (event) => {
    updateState({
      ...currentState,
      password: event.target.value,
    });
  };

  const onGenderChange = (g) => {
    updateState({
      ...currentState,
      gender: g,
    });
  };

  const onBalanceChange = (e) => {
    updateState({
      ...currentState,
      balance: e.target.value,
    });
  };

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  // To be called in order to submit the state to the server
  const onSubmit = () => {
    console.log(window.qt_object);
    let validationMessage = validateState(currentState);
    if (validationMessage !== "OK") {
      updateSnackbarState({
        ...snackBarState,
        isOpen: true,
        message: validationMessage,
      });
    } else {
      
      if (images.length === 0) {
        updateSnackbarState({
          ...snackBarState,
          isOpen: true,
          message: "Please upload an image",
        });
      } else {
        updateIsAdminBeingAdded(true);
        // All the validation step ends here and the logic for
        // sending the data to the server is written here
        let toSubmitState = {
          ...currentState,
          image_data: images[0].data_url.substring(images[0].data_url.indexOf(",") + 1),
          file_name: images[0].file.name,
          password: sha256(currentState.password.trim()),
        };
        
        delete toSubmitState.confirm_password;
        window.qt_object.addAdmin(JSON.stringify(toSubmitState));
        window.qt_object.addAdminResponse.connect((data)=> {
          if(data === "OK"){
            updateSnackbarState({
              ...snackBarState,
              message : "Admin was added successfully",
              severity : "success",
              isOpen : true
            })
            
          }else{
            updateSnackbarState({
              ...snackBarState,
              message : "Err: " + data,
              severity : "error",
              isOpen : true
            });
          }
           updateIsAdminBeingAdded(false);
        });
      }
    }
  };


  return (
    <>
      <Snackbar
        open={snackBarState.isOpen}
        onClose={handleSnackBarClose}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <MuiAlert severity={snackBarState.severity} variant="filled"> {snackBarState.message} </MuiAlert>
      </Snackbar>
      <div className="page_detail">
        <div className="page_detail_header">Add User</div>
        <input className="enter_full_name" placeholder={FULL_NAME_PLACEHOLDER} onChange={onEnterFullNameChange}/>
        <EnterID type="number" placeholder={ID_PLACEHOLDER} onChange={onEnterIDChange}/>
        <EnterPassword type="number" placeholder={PASSWORD_PLACEHOLDER} onChange={onEnterPasswordChange}/>
        <WrapperMaleFemaleWrapper>
          <MaleFemaleWrapper>
            <Gender
              type="radio"
              value="M"
              name="gender"
              onChange={() => onGenderChange("M")}
            />
            <span style={{ marginLeft: "4px" }}>Male</span>
          </MaleFemaleWrapper>
          <MaleFemaleWrapper>
            <Gender
              type="radio"
              value="F"
              name="gender"
              onChange={() => onGenderChange("F")}
            />
            <span style={{ marginLeft: "4px" }}>Female</span>
          </MaleFemaleWrapper>
        </WrapperMaleFemaleWrapper>
        <EnterDOB>Enter Starting Balance :</EnterDOB>
        <Balance placeholder="Balance" type="number" onChange={onBalanceChange} value={currentState.balance} />
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
            dragProps,
          }) => (
            // write your building UI
            <div>
              <button
                className="upload_image"
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click To Upload Image
              </button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image["data_url"]} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <button className="update_remove" onClick={() => onImageUpdate(index)}>
                      Update
                    </button>
                    <button className="update_remove" onClick={() => onImageRemove(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
        <div className="submit" onClick={isAdminBeingAdded ? () => {} : onSubmit}>
          {isAdminBeingAdded ? <LinearProgress
            color="inherit"
            style={{ height: "19px", width: "100%" }}
          /> : "Submit"}
        </div>
      </div>
    </>
  );
};

const EnterID = styled.input`
  margin-top: 16px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 50%;
`;
const EnterPassword = styled.input`
  margin-top: 16px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 40%;
`;

const WrapperMaleFemaleWrapper = styled.div`
  display: flex;
`;

const MaleFemaleWrapper = styled.div`
  padding: 16px 8px 8px 8px;
  display: inline-block;
  font-family: "Ubuntu", sans-serif;
  font-size: 16px;
`;

const Gender = styled.input`
  display: inline-block;
`;

const Balance = styled.input`
  margin-top: 16x;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 10%;
`;

const EnterDOB = styled.div`
  font-weight: bold;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 18px;
  font-family: "Ubuntu", sans-serif;
`;
