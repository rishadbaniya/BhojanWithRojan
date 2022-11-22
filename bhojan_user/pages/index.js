import Head from 'next/head';
import Image from 'next/image';
import Login from '../Components/Login/index.js';
import DevelopedBy from '../Components/DevelopedBy';
import Logo from '../Components/Logo';
import { useEffect, useState } from 'react';
import {QWebChannel} from 'qwebchannel';
import User from '../Components/User/index.js';

const QT_WEBSOCKET_ADDRESS = "ws://localhost:12350";

export default function Home() {
  const [userState, updateUserState] = useState({
    isLoggedIn : false,
    userData : null
  });

  const onExit = () =>{
    updateUserState({
      isLoggedIn : false,
      userData : null
    })
  }

  const onPay = (d) =>{
    onExit()
  }

  const onLogin = (d) => {
    updateUserState({
      isLoggedIn : true,
      userData : {
        ...d
      }
    })
  }

  useEffect(() => {
    let socket = new WebSocket(QT_WEBSOCKET_ADDRESS);
    socket.onerror = () => {
      console.log("SOCKET OPENED AT" + QT_WEBSOCKET_ADDRESS)
    };

    socket.onclose = () => {
      console.log("SOCKET CLOSED AT" + QT_WEBSOCKET_ADDRESS)
    };

    socket.onopen = () => {
      console.log("SOCKET OPENED AT ws://localhost:12345")
      new QWebChannel(socket, (channel) => {
        window.qt_object = channel.objects.qt_object;
      });
    };
  }, []);
  return (
  <>
  <div className='root'>
    <Logo onLogin={onLogin} />
    <DevelopedBy />
    {!userState.isLoggedIn ? 
        <Login onLogin={onLogin}/> : 
        <User userData={userState.userData} onPayOrExit={onPay}/>
    }
  </div>
  
  </>)
}