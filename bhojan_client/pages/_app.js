import '../styles/globals.css'
import {useState} from 'react';
import { Button } from '@mui/material';

const PAGE_BUTTON = {
  INACTIVE : {
    "background" : "linear-gradient(145deg, #f0f0f0, #cacaca)",
    "box-shadow" : "5px 5px 10px #797979, -5px -5px 10px #ffffff"
  },

  ACTIVE : {
    "background" : "#e0e0e0",
    "box-shadow" : "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
   }
}

const PageButton = (props) => {
  return <>
    <div className="control_points_button" 
         onClick={props.onClick} 
         style={props.index === props.currentIndex ? PAGE_BUTTON.ACTIVE : PAGE_BUTTON.INACTIVE}>{props.children}
    </div>
  </>
}

const StaffInformation = (props) => {
  return <div className="staff_information">
    </div>

} 


// Tab that displays the users that are in the queue for that food
const CurrentQueue = () => {
  return <>
      <div className="all_foods">
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
          <Order />
      </div>
    </>
}


const Order = () => {
    return <div className="order_wrapper"><div className="order">
      <div>ID : 6969</div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "success" style={{textTransform : "none"}}>View Order</Button></div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "error" style={{textTransform : "none"}}>Cancel Order</Button></div>
      <div style={{paddingTop : "24px"}}><Button variant="contained" color = "error" style={{textTransform : "none"}}>Order Complete</Button></div>
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
  const [pageIndex, changePageIndex] = useState(0);
  return <>
    <StaffInformation />
    <QueueImmediateDetails />
    <div className="root">
      <CurrentQueue />
    </div>
    </>
  }


// Drink Card
const Drink = () => {
  return
  <div className="drink">
    asldfjlfajsdlfjaslfjsldjfas sldjffffffff
  </div>
}
// Food Card
const Food = () => {

}

export default MyApp
