#pragma once
#ifndef _USERFOOD_H_
#define _USERFOOD_H_
#include <iostream>
#include <sqlite3.h>
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"

#include "utils.h"

using namespace std;
using namespace rapidjson;

int _getFoodCategoriesExecCallBack(void* _all_food_categories_JSON, int argc, char **argv, char **azColName){
   string* all_food_categories_JSON = (string*)_all_food_categories_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   writer.Key(azColName[0]);
   writer.String(argv[0]);
   writer.EndObject();
   all_food_categories_JSON->append(s.GetString());
   all_food_categories_JSON->append(",");
   return 0;
}

//Callback to be called after the admins are retrieved from the database
int _getFoodsExecCallBack(void* _all_foods_JSON, int argc, char **argv, char **azColName){
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

string getFoodCategories(){
        sqlite3* db;
        int isConnected = sqlite3_open(DB.c_str(), &db);
        string query = "SELECT category FROM TABLE_NAME";
        query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), FOOD_CATEGORIES_TABLE);
        string all_food_categories_JSON = "[";
        sqlite3_exec(db, query.c_str(), _getFoodCategoriesExecCallBack, &all_food_categories_JSON, NULL);
        if(all_food_categories_JSON.length() > 1){
            all_food_categories_JSON.pop_back();
        }
        all_food_categories_JSON.append("]");
        sqlite3_close(db);
        return all_food_categories_JSON;
}


string getFoods(string category){
      sqlite3* db;
      int isConnected = sqlite3_open(DB.c_str(), &db);
      if(isConnected == SQLITE_OK){
            string query = "SELECT * FROM TABLE_NAME";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), category);

            string all_foods_JSON = "[";
            sqlite3_exec(db, query.c_str(), _getFoodsExecCallBack, &all_foods_JSON, NULL);
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

#endif
