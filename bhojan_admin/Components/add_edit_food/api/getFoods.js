const getFoods = (category ,onLoad) => {
    window.qt_object.getFoods(category);
    window.qt_object.getFoodsResponse.connect((d)=>{
        try{
            onLoad(JSON.parse(d));
        }catch{
            onLoad([]);
        }
    });
}

export default getFoods;