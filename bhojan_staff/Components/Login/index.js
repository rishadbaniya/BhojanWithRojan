import { useState } from "react";
import { NumberPad } from "./NumberPad";
import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import sha256 from "sha256";
import parseJson from "parse-json";

// onLogin => Callback to be called after the user has successfully been authenticated
const Login = ({onLogin}) => {
    const [idState, updateIdState] = useState("");
    const [passwordState, updatePasswordState] = useState("");
    const [isIdFocused, updateIsIdFocused] = useState(true);
    const [isPasswordFocused, updateIsPasswordFocused] = useState(false);
    const [isLoggingIn, updateIsLogging] = useState(false);
    const [snackBar, updateSnackBar] = useState({
        isOpen : false,
        severity : null,
        message : null
    });

    const onLoginClick = () => {
        if(idState === ""){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : "Please Enter Your Id"
            });
        }else if(passwordState === ""){
            updateSnackBar({
                isOpen : true,
                severity : "error",
                message : "Please Enter Your Password"
            });
        }else{
            updateIsLogging(true);
            const sendState = {
                id : parseInt(idState),
                password : sha256(`${passwordState}`)
            }
            window.qt_object.userLogin(JSON.stringify(sendState));
            console.log(sendState)
            window.qt_object.userLoginResponse.connect((d) => {
                try{
                    const resp = parseJson(d);
                    onLogin(resp);
                }catch{
                    updateSnackBar({
                        isOpen : true,
                        severity : "error",
                        message : "Err : " + d
                    });
                }
                updateIsLogging(false)
            });
        }
    }

    const handleSnackBarClose = () => {
        updateSnackBar({
            ...snackBar,
            isOpen : false
        })
    }



    return <>
    <NumberPad state={isIdFocused ? idState : (isPasswordFocused ? passwordState : "" )}
        updateState={isIdFocused ? updateIdState : (isPasswordFocused ? updatePasswordState : () => {})}
    />
      
    <Snackbar open={snackBar.isOpen} onClose={handleSnackBarClose} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "left" }} >
        <MuiAlert severity={snackBar.severity} variant="filled"> {snackBar.message} </MuiAlert>
    </Snackbar>
        <div className="login">
            <input className="student_input" id="student_input_id" placeholder="Enter Student ID" value={idState} onFocus={() => {
                updateIsIdFocused(true);
                updateIsPasswordFocused(false);
            }} />
            <input className="student_input" id="student_input_password" placeholder="Enter Password" type="password" value={passwordState} onFocus = {() => {
                updateIsIdFocused(false);
                updateIsPasswordFocused(true);
            }}/>
            <div 
             style={{padding : "16px",  position:"absolute", top : "200px" , left: "35%"}} className="login_button_wrapper">
                {isLoggingIn ? <_CircularProgress /> : <LoginButton onClick={onLoginClick}/>}
            </div>
        </div>
        
    </>
}

const _CircularProgress = () => {
    return <div style={{display : "flex", justifyContent : "center"}}>
            <CircularProgress />
        </div>
}

const _SnackBar_ = ({open, onClose, severity, message}) => {
    
}

const LoginButton = ({onClick}) => {
    return <Button variant="contained" className="login_button" onClick={onClick}>Login</Button>
}




const EnterID = () => {
    return <input placeholder="Enter your ID"/>

}

const EnterPassword = () => {

}



export default Login;