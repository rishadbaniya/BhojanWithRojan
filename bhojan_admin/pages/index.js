import { QWebChannel } from "qwebchannel";
import Admin from "./Admin";
import sha256 from "sha256";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";

const DEVELOPERS = [
  "Rishad Baniya",
  "Anish Pradhan",
  "Kapil Adhikari",
  "Rojan Gautam",
];

const DevelopedBy = () => {
  return (
    <>
      <div className="developed_by">
        <div className="developed_by__title">Developed By</div>
        <hr className="developed_by__horizontal_division" />
        <div className="developed_by__developers">{DEVELOPERS[0]}</div>
        <div className="developed_by__developers">{DEVELOPERS[1]}</div>
        <div className="developed_by__developers">{DEVELOPERS[2]}</div>
        <div className="developed_by__developers">{DEVELOPERS[3]}</div>
      </div>
    </>
  );
};

const EnterUsername = (props) => {
  return (
    <div className="enterusername_wrapper">
      <input
        onChange={props.onChange}
        class="inputbox"
        placeholder="Enter your username"
      />
    </div>
  );
};

const EnterPassword = (props) => {
  return (
    <div className="enterpassword_wrapper">
      <input
        onChange={props.onChange}
        className="inputbox"
        placeholder="Enter your password"
      />
    </div>
  );
};

const LoginButton = ({ isLoginDisabled, onClick }) => {
  return (
    <div className="loginbutton_wrapper">
      <div
        onClick={!isLoginDisabled ? onClick : () => {}}
        className="login__login_button"
      >
        {isLoginDisabled ? (
          <LinearProgress
            color="inherit"
            style={{ height: "19px", width: "100%" }}
          />
        ) : (
          "Login"
        )}
      </div>
    </div>
  );
};

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
  const [isSnackBarOpen, updateSnackbarState] = useState(false);
  const [isLoginDisabled, updateIsLoginDisabled] = useState(false);

  const handleClose = () => {
    updateSnackbarState(!isSnackBarOpen);
  };

  const onLoginClick = () => {
    updateIsLoginDisabled(true);
    const loginCredentials = {
      username: currentState.username.trim(),
      password: sha256(currentState.password.trim()),
    };
    console.log(JSON.stringify(loginCredentials));
    console.log(window.qt_object);
    window.qt_object.sendLoginCredentials(JSON.stringify(loginCredentials));
    window.qt_object.sendText.connect((data) => {
      updateSnackbarState(true);
      if (data === "A_TOKEN_OF_LOGIN_LOVE") {
        updateState({
          ...currentState,
          isLoggedIn: true,
        });
      }
      updateIsLoginDisabled(false);
    });
  };

  useEffect(() => {
    let socket = new WebSocket("ws://localhost:12345");
    console.log("Came here");
    socket.onerror = () => {
      console.log("Fuck");
    };

    socket.onclose = () => {
      console.log("Closed");
    };

    socket.onopen = () => {
      new QWebChannel(socket, (channel) => {
        console.log(channel);
        window.qt_object = channel.objects.qt_object;
        console.log("I OPENED");
      });
    };
  }, []);

  return (
    <>
      <Snackbar
        open={isSnackBarOpen}
        onClose={handleClose}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {currentState.isLoggedIn ? (
          <MuiAlert severity="success" variant="filled">
            Logged in successfully!
          </MuiAlert>
        ) : (
          <MuiAlert severity="error" variant="filled">
            Logged in successfully!
          </MuiAlert>
        )}
      </Snackbar>

      <div className="root">
        {currentState.isLoggedIn ? (
          <>
            <Admin />
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
