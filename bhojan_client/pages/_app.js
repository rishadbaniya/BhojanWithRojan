import '../styles/globals.css'
import {useState, useEffect} from 'react';
import { Button } from '@mui/material';
import {Dialog} from '@mui/material';
import { QWebChannel } from "qwebchannel";

const QT_WEBSOCKET_ADDRESS = "ws://localhost:12355"

const StaffInformation = (props) => {
  return <div className="staff_information">
    </div>
} 


// Tab that displays the users that are in the queue for that food
const CurrentQueue = () => {
  const [dialogState, setDialogState] = useState({
    show : false,
    bill : [] 
  });

  const onDialogClose = () => {
    setDialogState({
      ...dialogState,
      show : false
    });
  }
  const [orders, updateOrders] = useState([]);

  const completeOrDelete = (data) =>{
      let total = 0;
      const __orders = orders;
      __orders.splice(data.index, 1);
      updateOrders(__orders);

      delete data.index;
      JSON.parse(data.bill).map((d) => {
        total += d.rate * d.quantity
      })

      data = {
        ...data,
        total_amount : total
      }

      window.qt_object.deleteOrCompleteOrder(JSON.stringify(data));
      onDialogClose();
  }

  useEffect(()=> {
    window.setTimeout(() =>{
      console.log("FUCK BRO");
      window.qt_object.getOrders(JSON.stringify({operation : "GET_ORDERS"}));
      window.qt_object.getOrdersResponse.connect((b) => {
        try{
          updateOrders(JSON.parse(b));
          console.log(JSON.parse(b));
       }catch(e){
        }
      });
    }, 1000);
  },[]);

  return <>
      <Dialog onClose={onDialogClose} open={dialogState.show}>
            <div className="bill">
              <table style={{border: "solid black 2px", width : "400px"}}>
                <thead style={{fontWeight : "bold"}}>
                  <tr>
                  <td>Item</td>
                  <td>Quantity</td>
                  </tr>
                </thead>
                <tbody>
                  {dialogState.bill.map((d,i) =>{
                      return <tr key={i} style={{paddingTop : "30px"}}>
                        <td>{d.item}</td>
                        <td>{d.quantity}</td>
                      </tr>
                  })}
                </tbody>
              </table>
            </div>
      </Dialog>
      <div className="all_foods">
          {
            orders.map((data, i) => {
              return <Order key={i} id={data.user_id} orders={data.items} updateDialog={(_bill)=>{setDialogState({show : true, bill : _bill})}} onCompleteOrDelete={completeOrDelete} index={i}/>
            })
          }
      </div>
    </>
}


const Order = ({id, orders, updateDialog, onCompleteOrDelete, index}) => {
    const json_order = orders;
    const handleCompleteOrDelete = (operation) => {
      onCompleteOrDelete({
        operation : operation,
        bill : json_order,
        id : parseInt(id),
        index : index
      })
    }
    
    orders = JSON.parse(orders);
    return <div className="order_wrapper"><div className="order">
      <div>{id}</div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "success" style={{textTransform : "none"}} onClick={() => updateDialog(orders)}>View Order</Button></div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "error" style={{textTransform : "none"}} onClick={() => handleCompleteOrDelete("DELETE_ORDER")}>Cancel Order</Button></div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "error" style={{textTransform : "none"}} onClick={() => handleCompleteOrDelete("COMPLETE_ORDER")}>Order Complete</Button></div>
    </div></div>
}

const QueueImmediateDetails = () => {
  return <>
    <div className="queue_immediate_details">
        <div>Queue Details</div>
    </div>
    </>
}


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log("SHOULD BE CALLED JUST ONCE");
    let socket = new WebSocket(QT_WEBSOCKET_ADDRESS);
    socket.onerror = () => {
      console.log("CANNOT CONNECT TO THE SOCKET AT ws://localhost:12355")
    };

    socket.onclose = () => {
      console.log("SOCKET CLOSED AT ws://localhost:12355")
    };

    socket.onopen = () => {
      console.log("SOCKET OPENED AT ws://localhost:12355")
      new QWebChannel(socket, (channel) => {
        window.qt_object = channel.objects.qt_object;
      });
    };
  }, []);

  return <>
    <StaffInformation />
    <QueueImmediateDetails />
    <div className="root">
      <CurrentQueue />
    </div>
    </>
  }

export default MyApp
