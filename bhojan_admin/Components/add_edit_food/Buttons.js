import { Button , IconButton} from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';

export const AddCategoryButton = ({onClick}) => {
    return <Button color="success"
                variant="contained" 
                className="add_food_category_button" 
                onClick={onClick}> Add Food Category</Button>
}

export const EditFoodCategoriesButton = ({onClick}) => {
    return <Button 
                color="error" 
                variant="contained" 
                className="edit_food_categories"
                onClick={onClick}>Edit Food Categories</Button>
}

export const DeleteCurrentlySelectedFoodCategory = ({onClick}) => {
    return <div style={{display: "flex", justifyContent:"space-between"}}><Button 
                color="error" 
                variant="contained" 
                className="edit_food_categories"
                onClick={onClick}>Delete Currently Selected Food Category
            </Button></div>

}

export const AddFood = ({onClick, foodCategories, currentTab}) => {
    if(foodCategories.length !== 0){
        return <Fab className="add_food" onClick={onClick} variant="extended" color="success" aria-label="add"> Add Food For {foodCategories[currentTab].category}
            <AddIcon />
        </Fab> 
    }else{
        return <></>
    }
}

export const CrossButton = ({onClick,}) => {
        return <div style={{width :"100%", display : "flex", justifyContent : "end"}}>
        <IconButton component="label" onClick={onClick}>
            <CloseIcon />
        </IconButton>
      </div>
}