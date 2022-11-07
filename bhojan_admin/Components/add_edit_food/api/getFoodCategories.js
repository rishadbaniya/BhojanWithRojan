const getFoodCategories = (onLoad) => {
    window.qt_object.getFoodCategory(JSON.stringify({
        operation : "GET"
    }));
    window.qt_object.getFoodCategoryResponse.connect((d)=>{
        try{
            onLoad(JSON.parse(d));
        }catch{
            onLoad([]);
        }
    });
}

export default getFoodCategories;