import '../styles/globals.css'
import '../Components/Components.css';
import { QWebChannel } from "qwebchannel";
import { useEffect } from 'react'; 

const QT_WEBSOCKET_ADDRESS = "ws://localhost:12345";
const MyApp = ({ Component, pageProps }) => {

  useEffect(() => {
    console.log("SHOULD BE CALLED JUST ONCE");
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

  return <Component {...pageProps} />
}

export default MyApp
