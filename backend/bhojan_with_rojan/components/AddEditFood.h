#pragma once

#ifndef _ADD_EDIT_FOOD_H_
#define _ADD_EDIT_FOOD_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <sqlite3.h>
#include "utils.h"
#include <algorithm>
#include <iostream>
#include <sqlite3.h>
#include <fstream>
#include <filesystem>
#include "../libs/base64.h"

using namespace rapidjson;
using namespace std;

int getFoodCategoriesExecCallBack(void* _all_food_categories_JSON, int argc, char **argv, char **azColName){
   string* all_food_categories_JSON = (string*)_all_food_categories_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   int i;
   for(i = 0; i < argc; i++){
        writer.Key(azColName[i]);
        writer.String(argv[i]);
   }
   writer.EndObject();
   all_food_categories_JSON->append(s.GetString());
   all_food_categories_JSON->append(",");
   return 0;
}

int doesFoodCategoryAlreadyExistExecCallBack(void* _isFoodCategoryTaken, int argc, char **argv, char **azColName){
   bool* isFoodCategoryTaken = (bool*)_isFoodCategoryTaken;
   int i;
   for(i = 0; i < argc; i++){
       *isFoodCategoryTaken = true;
   }
   return 0;
}

int deleteFoodCategoryExecCallBack(void* _table_name, int argc, char **argv, char **azColName){
   string* table_name = (string*)_table_name;
   *table_name = argv[0];
   return 0;
}

int deleteImagesExecCallBack(void* _, int argc, char **argv, char **azColName){
   cout << argv[0] << endl;
   remove(argv[0]);
   return 0;
}

string deleteFood(string req){
    cout << req << endl;
    string food_name = req.substr(0, req.find(','));
    string food_table = req.substr(req.find(',') + 1);

   sqlite3* db;
   int isConnected = sqlite3_open(DB.c_str(), &db);
   if(isConnected == SQLITE_OK){
       string query = "DELETE FROM TABLE_NAME where food_name = 'FOOD_NAME'";
       query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), food_table);
       query.replace(query.find("FOOD_NAME"), strlen("FOOD_NAME"), food_name);
        
       sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
       cout << query << endl;
       sqlite3_close(db);
       return "OK";
   }else{
       sqlite3_close(db);
       return "DATABASE_ERROR_OCCURED";
   }
}

class AddEditFoodCategory{
    public:
        string category_name; // Name of the food category
        string operation; // Operation, whether to "RENAME", "ADD", "DELETE", "GET" a food category
        string new_category_name; // To be only used when operation == "RENAME"
    
            AddEditFoodCategory(const char* req_json){
                Document doc;
                doc.Parse(req_json); // NOTE : WRONG COMPILER ERROR FROM CCLS
                this->operation = doc["operation"].GetString();
                if(operation !="GET"){
                    this->category_name = doc["category_name"].GetString();
                    if(operation == "RENAME"){
                        this->new_category_name = doc["new_category_name"].GetString();
                    }
                }
            }

            string perform_operation(){
                sqlite3* db;
                int isConnected = sqlite3_open(DB.c_str(), &db);
                if(isConnected == SQLITE_OK){
                    createCategoryTableIfNotExist(db);
                    if(operation == "GET"){
                        return getFoodCategories(db);
                    }else if(operation == "ADD"){
                        return addFoodCategory(db);
                    }else if(operation == "RENAME"){
                        return "RENAME";
                    }else if(operation == "DELETE"){
                        return deleteFoodCategory(db);
                    }else{
                        return "INVALID_OPERATION";
                    }

                }else{
                    sqlite3_close(db);
                    return "DATABASE_ERROR_OCCURED";
                }
            }

            string deleteFoodCategory(sqlite3* db){
                string query = "SELECT table_name FROM TABLE_NAME WHERE category='FOOD_CATEGORY'";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                query.replace(query.find("FOOD_CATEGORY"), strlen("FOOD_CATEGORY"), category_name);
                string table_name = "";
                sqlite3_exec(db, query.c_str(), deleteFoodCategoryExecCallBack, &table_name, NULL);

                if(table_name != ""){
                    cout << table_name << endl;
                    string query_1 = "DELETE FROM TABLE_NAME WHERE category='FOOD_CATEGORY'";
                    query_1.replace(query_1.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                    query_1.replace(query_1.find("FOOD_CATEGORY"), strlen("FOOD_CATEGORY"), category_name);
                    sqlite3_exec(db, query_1.c_str(), NULL, NULL, NULL);

                    string image_deletion_query  = "SELECT image_path FROM TABLE_NAME";
                    image_deletion_query.replace(image_deletion_query.find("TABLE_NAME"), strlen("TABLE_NAME"), table_name);
                    sqlite3_exec(db, image_deletion_query.c_str(),deleteImagesExecCallBack, NULL, NULL);

                    string query_2 = "DROP TABLE TABLE_NAME";
                    query_2.replace(query_2.find("TABLE_NAME"), strlen("TABLE_NAME"), table_name);
                    sqlite3_exec(db, query_2.c_str(),NULL, NULL, NULL);
                    sqlite3_close(db);
                    return "OK";
                }else{
                    sqlite3_close(db);
                    return "CANT DELETE FOR NO REASON";
                }
            }

            bool doesFoodCategoryAlreadyExist(sqlite3* db, string category_name){
                string query = "SELECT * FROM TABLE_NAME WHERE category='FOOD_CATEGORY'";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                query.replace(query.find("FOOD_CATEGORY"), strlen("FOOD_CATEGORY"), category_name);
                bool isFoodCategoryTaken = false;
                sqlite3_exec(db, query.c_str(), doesFoodCategoryAlreadyExistExecCallBack, &isFoodCategoryTaken, NULL);
                return isFoodCategoryTaken;
            }
            
           static string getFoodCategories(sqlite3* db){
                string query = "SELECT * FROM TABLE_NAME";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                string all_food_categories_JSON = "[";
                sqlite3_exec(db, query.c_str(), getFoodCategoriesExecCallBack, &all_food_categories_JSON, NULL);
                if(all_food_categories_JSON.length() > 1){
                    all_food_categories_JSON.pop_back();
                }
                all_food_categories_JSON.append("]");
                sqlite3_close(db);
                return all_food_categories_JSON;
            }

            string addFoodCategory(sqlite3* db){
                 if(!doesFoodCategoryAlreadyExist(db, category_name)){
                     string query = "INSERT INTO TABLE_NAME VALUES ('FOOD_CATEGORY', 'FOOD_CATEGORY_TABLE_NAME')";
                     query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                     query.replace(query.find("FOOD_CATEGORY"), strlen("FOOD_CATEGORY"), category_name);
                     query.replace(query.find("FOOD_CATEGORY_TABLE_NAME"), strlen("FOOD_CATEGORY_TABLE_NAME"), category_name);
                     sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);

                     string query_1 = "CREATE TABLE TABLE_NAME("
                            "food_name VARCHAR(50),"
                            "rate INT,"
                            "image_path VARCHAR(100)"
                            ")";

                     query_1.replace(query_1.find("TABLE_NAME"), strlen("TABLE_NAME"), category_name);
                     sqlite3_exec(db, query_1.c_str(), NULL, NULL, NULL);
                     sqlite3_close(db);
                     return "OK";
                 }else{
                     return "FOOD CATEGORY ALREADY EXISTS";
                 }
            }

            void createCategoryTableIfNotExist(sqlite3* db){
                string query = "CREATE TABLE IF NOT EXISTS TABLE_NAME (category VARCHAR(50), table_name VARCHAR(50))";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
                sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
            }
};


int isFoodNameTakenExecCallBack(void* _isFoodNameTake, int argc, char **argv, char **azColName){
   bool* isFoodNameTaken = (bool*)_isFoodNameTake;
   int i;
   for(i = 0; i < argc; i++){
       *isFoodNameTaken = true;
   }
   return 0;
}

//Callback to be called after the admins are retrieved from the database
int getFoodsExecCallBack(void* _all_foods_JSON, int argc, char **argv, char **azColName){
   string* all_foods_JSON = (string*)_all_foods_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   int i;
   for(i = 0; i < argc; i++){
        writer.Key(azColName[i]);
        writer.String(argv[i]);
   }
   writer.EndObject();
   all_foods_JSON->append(s.GetString());
   all_foods_JSON->append(",");
   return 0;
}

class AddEditFood{
    public:
        string category;
        string food_name;
        int food_rate;
        Image image;
         
        AddEditFood(const char* req_json){

             // Maps all the JSON data into the struct, simply put, it deserializes everything
             Document doc;
             doc.Parse(req_json); // NOTE : WRONG COMPILER ERROR FROM CCLS
             this->category = doc["category"].GetString();
             this->food_name = doc["food_name"].GetString();
             this->food_rate = doc["food_rate"].GetInt();

             Image image;
             image.image_data = doc["image_data"].GetString();
             image.file_name = doc["file_name"].GetString();
             this->image = image;
        }


       // Checks if any food exists with given name 
        bool isFoodNameTaken(const char* _food_name, sqlite3* db){
             string query = "SELECT * FROM TABLE_NAME WHERE food_name='FOOD_NAME'";
             query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), category);
             query.replace(query.find("FOOD_NAME"), strlen("FOOD_NAME"), _food_name);
         
             bool isFoodNameTaken = false;
             sqlite3_exec(db, query.c_str(), isFoodNameTakenExecCallBack, &isFoodNameTaken, NULL);
             return isFoodNameTaken;
         
         }

        string add_food() {
             sqlite3* db;
             int isConnected = sqlite3_open(DB.c_str(), &db);
             if(isConnected == SQLITE_OK){
                 if(!isFoodNameTaken(food_name.c_str(), db)){
                     string image_path = createAndSaveBase64Image(image.file_name, image.image_data, food_name, category);
                     string query = "INSERT INTO TABLE_NAME VALUES ('FOOD_NAME', RATE, 'IMAGE_PATH')";
                     query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), category);
                     query.replace(query.find("FOOD_NAME"), strlen("FOOD_NAME"), food_name);
                     query.replace(query.find("RATE"), strlen("RATE"), to_string(food_rate));
                     query.replace(query.find("IMAGE_PATH"), strlen("IMAGE_PATH"), image_path);
         
                     sqlite3_exec(db, query.c_str(), NULL, 0, NULL);
                     sqlite3_close(db);
                     return "OK";
                 }else{
                     return "THE FOOD NAME IS TAKEN";
                 }
             }else{
                 return "DATABASE_ERROR_OCCURED";
             }
        }

        static string get_foods(string category){
             sqlite3* db;
             int isConnected = sqlite3_open(DB.c_str(), &db);
             if(isConnected == SQLITE_OK){
                   string query = "SELECT * FROM TABLE_NAME";
                   query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), category);

                   string all_foods_JSON = "[";
                   sqlite3_exec(db, query.c_str(), getFoodsExecCallBack, &all_foods_JSON, NULL);
                   if(all_foods_JSON.length() > 1){
                       all_foods_JSON.pop_back();
                   }
                   all_foods_JSON.append("]");
                   sqlite3_close(db);
                   return all_foods_JSON;
             }else{
                 return "DATABASE_ERROR_OCCURED";
             }
        }

         // Gets the base64 encoded string and name of the file, then creates the image file, returning the path of the file stored
         // relative to the webserver that's running, so that it c
         string createAndSaveBase64Image(string name, string image_base64, string image_name, string category){
             // The path fo the admin image that should be in is 
             // "./admin_pics/username.jpg"
             string _path = name.substr(name.find('.'));
             _path.insert(0, image_name);
             _path.insert(0, "_");
             _path.insert(0, category);
             _path.insert(0, "food_");
             ofstream file_stream;
             file_stream.open(_path);
             file_stream << base64_decode(image_base64);
             file_stream.close();
             return _path;
         }
};
#endif
