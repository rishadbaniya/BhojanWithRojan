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