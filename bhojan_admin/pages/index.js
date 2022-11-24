import Admin from "./Admin";
import sha256 from "sha256";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button } from "@mui/material";
import { useState } from "react";
import {EnterPassword, EnterUsername, LoginButton} from '../Components/admin_login/index';
import DevelopedBy from '../Components/DevelopedBy';


const LOGIN_SUCCESS = "Logged in Successfully";
let LOGIN_TOKEN = "";

const Login = ({
  onLoginClick,
  updateUserNameAndPass,
  currentState,
  isLoginDisabled,
}) => {
  const onPasswordChange = (event) => {
    updateUserNameAndPass({
      ...currentState,
      password: event.target.value,
    });
  };

  const onUsernameChange = (event) => {
    updateUserNameAndPass({
      ...currentState,
      username: event.target.value,
    });
  };

  return (
    <div className="login">
      <div className="login__login_title">Admin Login</div>
      <EnterUsername onChange={onUsernameChange} />
      <EnterPassword onChange={onPasswordChange} />
      <LoginButton onClick={onLoginClick} isLoginDisabled={isLoginDisabled} />
    </div>
  );
};

export default function Home() {
  const [currentState, updateState] = useState({
    isLoggedIn: false,
    username: "",
    password: "",
  });
  const [snackBarState, updateSnackbarState] = useState({
    isOpen : false,
    severity : null,
    message : null
  });
  const [isLoginDisabled, updateIsLoginDisabled] = useState(false);

  const handleClose = () => {
    updateSnackbarState({
      ...snackBarState,
      isOpen : false
    });
  };

  const onLoginClick = () => {
    updateIsLoginDisabled(true);
    const loginCredentials = {
      username: currentState.username.trim(),
      password: sha256(currentState.password.trim()),
    };
    console.log(JSON.stringify(loginCredentials));
    window.qt_object.sendLoginCredentials(JSON.stringify(loginCredentials));
    window.qt_object.sendText.connect((data) => {
        if (data.length === 64) {
        updateSnackbarState({
          isOpen : true,
          severity : "success",
          message : LOGIN_SUCCESS
        });
        LOGIN_TOKEN = data;
        updateState({
          ...currentState,
          isLoggedIn: true,
        });
      }else{
        updateSnackbarState({
          isOpen : true,
          severity : "error",
          message : "Err: " + data
        });
      }
      updateIsLoginDisabled(false);
    });
  };

  return (
    <>
    
      <Snackbar
        open={snackBarState.isOpen}
        onClose={handleClose}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
          <MuiAlert severity={snackBarState.severity} variant="filled">
            {snackBarState.message}
          </MuiAlert>
      </Snackbar>
      <div className="root">
        <ExitButton />
        {currentState.isLoggedIn ? (
          <>
            <LogOutButton updateState={updateState}/>
            <Admin token={LOGIN_TOKEN} username={currentState.username.trim()}/>
          </>
        ) : (
          <Login
            onLoginClick={onLoginClick}
            updateUserNameAndPass={updateState}
            currentState={currentState}
            isLoginDisabled={isLoginDisabled}
          />
        )}
        <DevelopedBy />
      </div>
    </>
  );
}

const LogOutButton = ({updateState}) => {
    return <Button color="success" variant="contained" onClick={() => {
        updateState({
            isLoggedIn: false,
            username: "",
            password: "",
      });
    }} style={{
        textTransform : "none",
        position : "absolute",
        bottom : "16px",
        right : "100px"
    }}>Log Out</Button>
}

const ExitButton = () => {
    return <Button color="error" variant="contained" onClick={() => {
      window.qt_object.exit();
    }} style={{
        textTransform : "none",
        position : "absolute",
        bottom : "16px",
        right : "16px"
    }}>Exit</Button>
}