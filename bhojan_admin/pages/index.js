import Head from 'next/head'
import Image from 'next/image'
import {QWebChannel} from 'qwebchannel';
import Admin from "./Admin";

import {useState, useEffect} from 'react';

const DEVELOPERS = [
  "Rishad Baniya",
  "Anish Pradhan",
  "Kapil Adhikari",
  "Rojan Gautam"
];

let X = 0;

const DevelopedBy = () =>{
  return <>
    <div className="developed_by">
        <div className="developed_by__title">Developed By</div>
        <hr className="developed_by__horizontal_division"/>
        <div className="developed_by__developers">{DEVELOPERS[0]}</div>
        <div className="developed_by__developers">{DEVELOPERS[1]}</div>
        <div className="developed_by__developers">{DEVELOPERS[2]}</div>
        <div className="developed_by__developers">{DEVELOPERS[3]}</div>
    </div>
    </>
}

const EnterUsername = (props) => {
   return <div className="enterusername_wrapper">
        <input onChange={props.onChange} class="inputbox" placeholder="Enter your username"/>
     </div>
}


const EnterPassword = (props) => {
   return <div className="enterpassword_wrapper">
        <input onChange={props.onChange}className="inputbox" placeholder="Enter your password" />
     </div>
}

const LoginButton = (props) => {
   return <div className="loginbutton_wrapper">
     <div onClick={props.onClick} className="login__login_button">Login</div>
    </div>

}

// TODO : Implement the callback for the transport portion of the QOBject
const loginClick = (username, password) =>{

    // Sending the SHA-256 Hash of the password to the Qt Business Logic Section 
  window.qt_object.sendLoginCredentials(`
  {
     "username" : ${username},
     "password" : ${password}
  }
  `);
}

const Login = ({onLoginClick}) => {
  const [username, updateUsername] = useState('');
  const [password, updatePass] = useState('');

  const handleOnChangePassword = (event) => {
    console.log(event.target.value);
    updateUsername(event.target.value);
  }

  const handleOnChangeUsername = (event) => {
    console.log(event.target.value);
    updatePass(event.target.value);
  }

  return <div className="login">
      <div className="login__login_title">Admin Login</div>
      <EnterUsername onChange={handleOnChangeUsername}/>
      <EnterPassword onChange={handleOnChangePassword}/>
      <LoginButton onClick={() => {
        //loginClick(username, password);
        onLoginClick();
    }}/>
   </div>
}

export default function Home() {
    
  const [isLoggedIn, updateIsLoggedIn] = useState(false);
  // TODO: On Login Click make sure you display a spinner as you are sending the login credentials to the server and you display
  // the login when the token arrives or clear out the login field and show the dispaly button again as soon as the toke arrives
  const onLoginClick = ()=>{
    updateIsLoggedIn(!isLoggedIn);
  }

  useEffect(()=>{
    let socket = new WebSocket("ws://localhost:12345");
    console.log("Came here");
    socket.onerror = () => {
        console.log("Fuck");
    }

    socket.onclose = () => {
        console.log("Closed");
    }

    socket.onopen = () => {
      new QWebChannel(socket, (channel) => {
        console.log(channel);
        window.qt_object = channel.objects.qt_object;
        console.log("I OPENED");

      });
    }
  },[]);

  return <>
      <div className="root">
        {isLoggedIn ? 
           <Admin /> : 
          <Login onLoginClick={onLoginClick}/> 
        }
        <DevelopedBy/>
      </div>
    </>
}


