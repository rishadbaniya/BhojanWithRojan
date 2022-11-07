// This function makes a POST request implicitly to "/add_edit_food_category"
// As following data and message
//{
//  "operation" : "ADD", ADD means to add as category
//  "category_name" : "Breakfast" which is the name of the category
//}
//
const addAFoodCategory = (food_category, onAddition) => {

    window.qt_object.addEditFoodCategoryResponse.connect((resp) => {
        if(resp === "OK"){
            onAddition({
                severity : "success",
                message : `The food category ${food_category} was added!`
            });
        }else{
            onAddition({
                severity : "error",
                message : `Err : ${resp}`
            });
        }
    })
}

export default addAFoodCategory;