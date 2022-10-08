import Head from 'next/head'
import Image from 'next/image'

const DEVELOPERS = [
  "Rishad Baniya",
  "Anish Pradhan",
  "Kapil Adhikari",
  "Rojan Gautam"
];

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

const EnterUsername = () => {
   return <div className="enterusername_wrapper">
        <input class="inputbox" placeholder="Enter your username"/>
     </div>
}

const EnterPassword = () => {
   return <div className="enterpassword_wrapper">
        <input class="inputbox" placeholder="Enter your password" />
     </div>
}

const LoginButton = () => {
   return <div className="loginbutton_wrapper">
       <div className="login__login_button">Login</div>
    </div>

}

const Login = () => {
  return <div className="login">
      <div className="login__login_title">Admin Login</div>
      <EnterUsername />
      <EnterPassword />
      <LoginButton />
   </div>
}

export default function Home() {
  return <>
      <div className="root">
        <Login />
        <DevelopedBy />
      </div>
    </>
}
