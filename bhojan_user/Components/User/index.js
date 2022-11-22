import {useState, useEffect} from 'react';
import UserInfo from "./UserInfo";
import BillAndPay from './BIllAndPay';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const User = ({userData, onPayOrExit}) => {
    const {department, full_name, id, image_path, token} = userData;
    const [balance, updateBalance] = useState(parseInt(userData.balance));
    const [snackBarState, updateSnackBarState]  = useState({
        isOpen : false,
        severity : "",
        message : ""
    });

    const onSnackClose = () => {
        updateSnackBarState({
            ...snackBarState,
            isOpen : false
        });
    }

    console.log(userData);
    const [itemsSelected, updateItemsSelected] = useState([]);

    // food parameter is a JS object of three keys 
    // item => The name of the food
    // rate => The rate of the food
    // quantity => The quantity of the food (1 means the food was added and -1 means the food was tried to be deducted)
    const onItemClick = (food) => {
        const _itemsSelected = [...itemsSelected];
        // If there is nothing in the array then only enter the item which is being added, not deducted
        if(itemsSelected.length === 0){
            if(food.quantity === 1){
                _itemsSelected.push({
                    item : food.item,
                    rate : food.rate,
                    quantity : 1,
                    amount : food.rate
                });
            }
        }else{
            // If any item matches, then just add or deduct the quantity
            let _index = -1;
            itemsSelected.map((data, index) => {
                if(data.item === food.item){
                    _index = index;
                }
            });

            if(_index != -1){
                _itemsSelected[_index].quantity += food.quantity;
            }else{
                if(food.quantity === 1){
                    _itemsSelected.push({
                        item : food.item,
                        rate : food.rate,
                        quantity : 1,
                        amount : food.rate * 1
                    });
                }
            }
        }

        // If any food as quantity of 0, then that food shall be removed from the array
        _itemsSelected = _itemsSelected.filter((d) => d.quantity > 0);
        updateItemsSelected(_itemsSelected);
    }


    console.log({userData});
    return <>

    <Snackbar open={snackBarState.isOpen} onClose={onSnackClose} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} >
          <MuiAlert severity={snackBarState.severity} variant="filled">{snackBarState.message}</MuiAlert>
     </Snackbar>
    <div>
        <UserInfo 
            id ={id}    
            full_name={full_name}
            department={department}
            image_url={"http://192.168.43.80:8000/"+ userData.image_path}
            balance={balance}
            balanceUpdateCallback={updateBalance}
        />
        <BillAndPay 
            currentBalance={balance} 
            itemsSelected={itemsSelected} 
            onPayClick={() => {
                if(itemsSelected.length === 0){
                    updateSnackBarState({
                        isOpen : true,
                        severity : "error",
                        message : "You didn't select any food"
                    });
                }else{
                    window.qt_object.payFood(id + JSON.stringify(itemsSelected));
                    window.qt_object.payFoodResponse.connect((resp)=>{
                        if(resp === "OK"){
                            onPayOrExit();
                        }else{
                            updateSnackBarState({
                                isOpen : true,
                                severity : "error",
                                message : resp
                            })
                        }
                    })
                }
            }} 
            onExitClick={onPayOrExit}
        />
        <Foods onItemClick={onItemClick}/>
    </div>
    </>
}

const getFoodCategories = (onLoad) => {
    window.qt_object.getFoodCategories("");
    window.qt_object.getFoodCategoriesResponse.connect((d) => {
        try{
            onLoad(JSON.parse(d));
        }catch{
            onLoad([]);
        }
    });
}

const getFoods = (category, onLoad) => {
    window.qt_object.getUserFoods(category);
    window.qt_object.getUserFoodsResponse.connect((d) => {
        try{
            onLoad(JSON.parse(d));
        }catch{
            onLoad([]);
        }
    });

}
const Foods = ({onItemClick}) => {
   const [foodCategories, updateFoodCategories] = useState([]);
   const [currentFoods, updateFoods] = useState([]);
   const [currentTab, updateTab] = useState(0);

   const handleTabChange = (_, v) => {
        updateTab(v);
        getFoods((foodCategories[v]).category, (__resp)=> updateFoods(__resp));
   }

   useEffect(() => {
        getFoodCategories((resp) => {
            updateFoodCategories(resp);
            if(resp.length !== 0){
                getFoods((resp[0]).category, (__resp)=> updateFoods(__resp));
            }
            
        });
   },[]);

   return <div className="center_part">
        <Box style={{width : "100%"}}>
            <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                { foodCategories.map((d ,i) => {
                        return <Tab className="tab" label={d.category} key={i}/>
                    })
                }
            </Tabs> 
        </Box>
        <div className='food_grid'>
            {
                currentFoods.map((d, i) => {
                    return <FoodCard key={i} food_name={d.food_name} value={d.rate} image_url={`http://172.20.150.212:8000/${d.image_path}`} onClick={onItemClick} />
                })
            }
        </div>
   </div> 
}

const FoodCard = ({onClick, food_name, value, image_url}) => {
    const _onClick = (quantity) => {
        onClick({
            item : food_name,
            quantity : quantity,
            rate : value,
        })
    }
    const [shouldShowAddDeduct, updateShouldShowAddDeduct] = useState(false);
    return <>
    <div className='food_card' onMouseEnter={() => {
        updateShouldShowAddDeduct(true)
    }} onMouseLeave={() => {
        updateShouldShowAddDeduct(false)
    }}>
        <div className="food_card_image_wrapper">
            {shouldShowAddDeduct ? <>
            <div className="food_card_add" onClick={()=> {_onClick(1)}}>
                <div>+</div>
            </div>
            <div className="food_card_deduct" onClick={() => {_onClick(-1)}}>
                <div>-</div>
                </div></> : <></>}
            <img height={130} width={130} className='food_card_image' alt="" src={image_url}/>
        </div>
        <div className="food_card_name">{food_name}</div>
        <div className="food_card_price">Rs {value}</div>
    </div>
    </>
}

export default User;
