import { useState } from "react";
import ImageUploading from "react-images-uploading";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import sha256 from "sha256";
import LinearProgress from "@mui/material/LinearProgress";

const FULL_NAME_PLACEHOLDER = "Enter your full name (Eg. Rishad Baniya)";
const USERNAME_PLACEHOLDER = "Enter your full name (Eg. rishadbaniya)";
const EMAIL_PLACEHOLDER = "Enter your email (Eg. baniyarishad@gmail.com)";
const PASSWORD_PLACEHOLDER = "Enter your password";
const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm your password";

const validateState = (state) => {
  if (state.full_name === null) {
    return "Full Name Field Is Empty";
  } else if (state.username === null) {
    return "Username Field Is Empty";
  } else if (state.password === null) {
    return "Password Field Is Empty";
  } else if (state.confirm_password === null) {
    return "Confirm Password Field Is Empty";
  } else if (state.password !== state.confirm_password) {
    return "Passwords do not match";
  } else if (state.gender === null) {
    return "Choose a gender";
  } else if (
    state.DOB.day === null ||
    state.DOB.day < 1 ||
    state.DOB.day > 33
  ) {
    return "Please enter valid day in DOB";
  } else if (
    state.DOB.month === null ||
    state.DOB.month < 1 ||
    state.DOB.month > 12
  ) {
    return "Please enter valid month in DOB";
  } else if (
    state.DOB.year === null ||
    state.DOB.year < 1900 ||
    state.DOB.year > 2024
  ) {
    return "Please enter valid year in DOB";
  } else {
    return "OK";
  }
};

const EmptyState = {
    full_name: null,
    username: null,
    email: null,
    password: null,
    confirm_password: null,
    gender: null,
    DOB: {
      month: null,
      day: null,
      year: null,
    }
};

export const AddAdmin = () => {
  
  const [snackBarState, updateSnackbarState] = useState({
    message: null,
    isOpen: false,
    severity: "error",
  });
  const [images, setImages] = useState([]);
  const [currentState, updateState] = useState(EmptyState);  // Entire state of Admin
  const [isAdminBeingAdded, updateIsAdminBeingAdded] = useState(false);

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

  const onEnterUsernameChange = (event) => {
    updateState({
      ...currentState,
      username: event.target.value,
    });
  };

  const onEnterEmailChange = (event) => {
    updateState({
      ...currentState,
      email: event.target.value,
    });
  };

  const onEnterPasswordChange = (event) => {
    updateState({
      ...currentState,
      password: event.target.value,
    });
  };

  const onEnterConfirmPasswordChange = (event) => {
    updateState({
      ...currentState,
      confirm_password: event.target.value,
    });
  };

  const onGenderChange = (g) => {
    updateState({
      ...currentState,
      gender: g,
    });
  };

  const onYearChange = (e) => {
    updateState({
      ...currentState,
      DOB: {
        ...currentState.DOB,
        year: e.target.value,
      },
    });
  };

  const onMonthChange = (e) => {
    updateState({
      ...currentState,
      DOB: {
        ...currentState.DOB,
        month: e.target.value,
      },
    });
  };
  const onDayChange = (e) => {
    updateState({
      ...currentState,
      DOB: {
        ...currentState.DOB,
        day: e.target.value,
      },
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
      updateIsAdminBeingAdded(true);
      if (images.length === 0) {
        updateSnackbarState({
          ...snackBarState,
          isOpen: true,
          message: "Please upload an image",
        });
      } else {
        // All the validation step ends here and the logic for
        // sending the data to the server is written here
        let toSubmitState = {
          ...currentState,
          image_data: images[0].data_url,
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
        <div className="page_detail_header">Add Admin</div>
        <input className="enter_full_name" placeholder={FULL_NAME_PLACEHOLDER} onChange={onEnterFullNameChange}/>
        <EnterUserNameEmail placeholder={USERNAME_PLACEHOLDER} onChange={onEnterUsernameChange}/>
        <EnterUserNameEmail placeholder={EMAIL_PLACEHOLDER} onChange={onEnterEmailChange}/>
        <EnterPassword type="password" placeholder={PASSWORD_PLACEHOLDER} onChange={onEnterPasswordChange}/>
        <ConfirmPassword type="password" placeholder={CONFIRM_PASSWORD_PLACEHOLDER} onChange={onEnterConfirmPasswordChange} />
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
        <EnterDOB>Enter Date Of Birth :</EnterDOB>
        <InputYear placeholder="Year" type="number" onChange={onYearChange} />
        <InputMonth
          placeholder="Month"
          type="number"
          onChange={onMonthChange}
        />
        <InputDay placeholder="Day" type="number" onChange={onDayChange} />
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

const EnterUserNameEmail = styled.input`
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
const ConfirmPassword = styled.input`
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
const InputYear = styled.input`
  margin-top: 16x;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 10%;
`;

const InputMonth = styled.input`
  margin-top: 16px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 8%;
`;

const InputDay = styled.input`
  margin-top: 16px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 40px;
  padding-left: 8px;
  border-radius: 8px;
  width: 8%;
`;

const EnterDOB = styled.div`
  font-weight: bold;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 18px;
  font-family: "Ubuntu", sans-serif;
`;
