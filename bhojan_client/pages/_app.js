import '../styles/globals.css'
import {useState} from 'react';

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
    <div>adlkfjalsdjf</div>
    <div>adlkfjalsdjf</div>
    <div>adlkfjalsdjf</div>
    <div>adlkfjalsdjf</div>
    </div>

}


// Tab that displays the users that are in the queue for that food
const CurrentQueue = () => {
  return <>
      <div className="all_foods">
      <div className="non_drinks">
        <div className="__drinks">
          <div className="drink">
          </div>
          <div className="drink">
          </div>
          <div className="drink">
          </div>
        </div>
      </div>
      </div>
    </>
}

// Tab that displays the information about the queue, 
// informations such as the total no of students in queue, 
// total drinks in queue, total no of certain foods in queue all that information
const QueueInformation = () => {

}

const History = () => {

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

      <div className="control_points">
        <PageButton index={0} currentIndex={pageIndex} onClick={() => changePageIndex(0)}>Food Queue</PageButton>
        <PageButton index={1} currentIndex={pageIndex} onClick={() => changePageIndex(1)}>Drinks Queue</PageButton>
        <PageButton index={2} currentIndex={pageIndex} onClick={() => changePageIndex(2)}>Queue Information</PageButton>
        <PageButton index={3} currentIndex={pageIndex} onClick={() => changePageIndex(3)}>History</PageButton>
      </div>
      {pageIndex === 2 ? <></> : pageIndex === 1 ? <></> : <CurrentQueue />}
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
