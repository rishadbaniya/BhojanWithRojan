import Image from 'next/image';
import {useState} from 'react';
import UserInfo from "./UserInfo";
import BillAndPay from './BIllAndPay';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FoodImage from '../../assets/download.jpeg';

const User = ({userData, onPayOrExit}) => {
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
    <div>
        <UserInfo 
            current_balance={userData.balance} 
            full_name={userData.full_name}
            department={userData.department} 
            image_url={"http://172.22.107.47:8000/"+ userData.image_path}
            id={userData.id}
        />
        <BillAndPay 
            currentBalance={1000} 
            itemsSelected={itemsSelected} 
            onPayClick={() => {}} 
            onExitClick={onPayOrExit}
        />
        <Foods onItemClick={onItemClick}/>
    </div>
    </>
}

const Foods = ({onItemClick}) => {
   const [currentTab, updateTab] = useState(0);
   const handleTabChange = (_, v) => {
    updateTab(v);

   }

   return <div className="center_part">
        <Box style={{width : "100%"}}>
            <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                <Tab className="tab" label="Drink"/>
                <Tab className="tab" label="Breakfast" />
                <Tab className="tab" label="Lunch" />
                <Tab className="tab" label="Snacks" />
                <Tab className="tab" label="Dinner" />
            </Tabs> 
        </Box>
        <div className='food_grid'>
            <FoodCard food_name={"Samosa"} value={20} image_url={"/"} onClick={onItemClick} />
            <FoodCard food_name={"Momo"} value={40} image_url={"/"} onClick={onItemClick} />
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
            <Image height={130} width={130} className='food_card_image' alt="" src={FoodImage}/>
        </div>
        <div className="food_card_name">{food_name}</div>
        <div className="food_card_price">Rs {value}</div>
    </div>
    </>
}

export default User;