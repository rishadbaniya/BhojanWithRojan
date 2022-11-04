import Head from 'next/head';
import Image from 'next/image';
import Login from '../Components/Login/index.js';
import DevelopedBy from '../Components/DevelopedBy';
import Logo from '../Components/Logo';
import { useEffect } from 'react';
import {QWebChannel} from 'qwebchannel';

const QT_WEBSOCKET_ADDRESS = "ws://localhost:12345";

export default function Home() {
  useEffect(() => {
    let socket = new WebSocket(QT_WEBSOCKET_ADDRESS);
    socket.onerror = () => {
      console.log("CANNOT CONNECT TO THE SOCKET AT ws://localhost:12345")
    };

    socket.onclose = () => {
      console.log("SOCKET CLOSED AT ws://localhost:12345")
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
    <Logo/>
    <DevelopedBy />
    <Login />
  </div>
  
  </>)
}
