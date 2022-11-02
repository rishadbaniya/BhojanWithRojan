import LinearProgress from "@mui/material/LinearProgress";

export const EnterUsername = (props) => {
  return (
    <div className="enterusername_wrapper">
      <input
        onChange={props.onChange}
        className="inputbox"
        placeholder="Enter your username"
      />
    </div>
  );
};

export const EnterPassword = (props) => {
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

export const LoginButton = ({ isLoginDisabled, onClick }) => {
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