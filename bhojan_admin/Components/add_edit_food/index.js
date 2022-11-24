import { useState, useRef, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AddCategoryButton, DeleteCurrentlySelectedFoodCategory, AddFood, CrossButton} from "./Buttons";
import { Tabs, Tab, Box, Dialog, Button} from "@mui/material";
import ImageUploading from "react-images-uploading";
import getFoodCategories from './api/getFoodCategories';
import getFoods from './api/getFoods';

const ADD_FOOD_CATEGORY = "Add a food category";

const AddEditFood = () => { 
    const add_food_category = useRef();
    const [snackBarState, updateSnackbarState] = useState({
        isOpen : false,
        severity : null,
        message : null
    });
    const [currentTab, updateTab] = useState(0);
    const [food_categories, updateFoodCategories] = useState([]);
    const [dialogState, updateDialogState] = useState(false);
    const [allFoods, updateAllFoods] = useState([]);

    const handleDialogClose = () => updateDialogState(false);
    const onSaveClick = (d) => {
        const state = {
            ...d,
            category : food_categories[currentTab].category
        }
        window.qt_object.addFood(JSON.stringify(state));
        window.qt_object.addFoodResponse.connect((d) => {
            console.log(d);
        });
        console.log(state);
        handleDialogClose();
        setTimeout(()=>{
            getFoods(food_categories[currentTab].category ,(d) => {updateAllFoods(d)});
        },400);
        
    }

    const onTabChange = (e, v)=>{
        // TODO : Get the food for that tab
        updateTab(v);
        getFoods(food_categories[v].category ,(d) => {updateAllFoods(d)});
    }

    const onSnackBarClose = () =>{
        updateSnackbarState({
            ...snackBarState,
            isOpen : false
        });
    }

    const handleAddFood = () => {
        updateDialogState(true);
    }



    const addFoodCategory = () => {
        if(add_food_category.current.value.length !== 0 && !(add_food_category.current.value.indexOf(' ') >= 0)){
            window.qt_object.addFoodCategory(JSON.stringify({
                operation : "ADD",
                category_name : add_food_category.current.value
            }));

            window.qt_object.addFoodCategoryResponse.connect((resp) => {
                getFoodCategories((d) => {updateFoodCategories(d)});
            });
        }else{
            updateSnackbarState({
                ...snackBarState,
                isOpen : true,
                severity : "error",
                message : "Enter a valid Food Category with No Spaces"
            });
        }
    }

    const deleteFoodCategory = () => {
        if(food_categories.length > 0){
            window.qt_object.deleteFoodCategory(JSON.stringify({
                operation : "DELETE",
                category_name : food_categories[currentTab].category
            }));

            window.qt_object.deleteFoodCategoryResponse.connect((resp) => {
                getFoodCategories((d) => {
                    updateFoodCategories(d);
                    updateTab(0);
                });
                getFoods(food_categories[currentTab].category ,(d) => {updateAllFoods(d)});
            });
        }else{
            updateSnackbarState({
                ...snackBarState,
                isOpen : true,
                severity : "error",
                message : "No Category left to delete!"
            });
        }
    }

    const deleteFood = (food_name) => {
        const table_name = food_categories[currentTab].table_name;
        window.qt_object.deleteFood(`${food_name},${table_name}`);
        let foodsList = [...allFoods];
        foodsList = foodsList.filter((d) => d.food_name !== food_name);
        
        window.qt_object.deleteFoodResponse.connect((resp) => {
            if(resp === "OK"){
                updateSnackbarState({
                    ...snackBarState,
                    isOpen : true,
                    severity : "success",
                    message :`The Food ${food_name} was deleted successfully` 
                });
                updateAllFoods(foodsList);
            }
        });
    }

    useEffect(()=>{
            getFoodCategories((d) => { 
                updateFoodCategories(d);
                if(d.length > 0 ){
                    getFoods(d[0].category ,(d) => {
                        updateAllFoods(d);
                    });
                }
            });
    },[]);

    return <>
    <AddFoodDialog isOpen={dialogState} onClose={handleDialogClose} onSaveClick={onSaveClick}/>
    <Snackbar open={snackBarState.isOpen} onClose={onSnackBarClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <MuiAlert variant="filled" severity={snackBarState.severity}>{snackBarState.message}</MuiAlert>
    </Snackbar>
    <div className="page_detail">
        <div className="page_detail_header">Add/Edit Food</div>
        <div>
            <input ref={add_food_category} className="add_food_category" placeholder={ADD_FOOD_CATEGORY}/>
            <AddCategoryButton onClick={() => {addFoodCategory()}}/>
        </div>
            <DeleteCurrentlySelectedFoodCategory onClick={deleteFoodCategory}/>
            <Box className="food_categories_tab">
                <Tabs value={currentTab} onChange={onTabChange} variant="scrollable" scrollButtons="auto">
                    {food_categories.map((d, i) => {
                         return <Tab className="food_category_tab" label={d.category} key={i}/>
                    })}
                </Tabs>
                <div className="tab_food_items">
                    {allFoods.map((d, i) => {
                        return <FoodCard key={i} 
                                         image_src={`http://10.42.0.1:8000/${d.image_path}`}
                                         onFoodDelete = {deleteFood}
                                         food_name={d.food_name}
                                         rate={d.rate}>
                                </FoodCard>
                    })}
                </div>
          </Box>
          <AddFood 
            foodCategories={food_categories} 
            onClick={handleAddFood} 
            currentTab={currentTab} 
          />
    </div>
    </>
}


const FoodCard = ({image_src, food_name, rate, onFoodDelete}) => {
    return <div className="food_card">
        <div><CrossButton onClick={() => onFoodDelete(food_name)}/></div>
        <img src={image_src} className="food_card_image"/>
        <div className="food_name">{food_name}</div>
        <div className="food_rate">{rate}</div>
    </div>
}

const AddFoodDialog = ({isOpen, onClose, onSaveClick}) => {
    const [images, setImages] = useState([]);

    const food_name = useRef();
    const food_rate = useRef();

    const onChange = (imageList) => {
        setImages(imageList);
    };

    const onSave = () => {
        if(food_name.current.value.length > 1 && parseInt(food_rate.current.value) > 0 && images.length >= 1){
        setImages([]);
        onSaveClick({
            food_name : food_name.current.value,
            food_rate : parseInt(food_rate.current.value),
            image_data: images[0].data_url.substring(images[0].data_url.indexOf(",") + 1),
            file_name: images[0].file.name,
        });
        }
    }

    return <Dialog open={isOpen} onClose={onClose}>
        <div className="add_food_dialog" >
        <div>
            <CrossButton onClick={() => onClose()}/>
        <input ref={food_name} className="add_food_name" placeholder="Enter food name"/>
        <input ref={food_rate} className="add_food_name" type="number" placeholder="Enter rate of the food"/>
        <ImageUploading
          value={images}
          onChange={onChange}
          maxNumber={10}
          dataURLKey="data_url"
          acceptType={["jpg", "png"]}
        >
          {({
            imageList,
            onImageUpload,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div>
              <button
                className="upload_image"
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click To Upload Image
              </button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image["data_url"]} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <button className="update_remove" onClick={() => onImageUpdate(index)}>
                      Update
                    </button>
                    <button className="update_remove" onClick={() => onImageRemove(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
        </div>
        <Button variant="contained" color="success" className="save_food_button" onClick={onSave}>Save</Button>
        </div>
    </Dialog>
}

export default AddEditFood;
