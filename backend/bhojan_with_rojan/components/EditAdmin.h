#pragma once
#ifndef _EDITADMIN_H_
#define _EDITADMIN_H_

#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"
#include <string.h>

using namespace std;
using namespace rapidjson;

int getAdminsExecCallBack(void* _all_admins_JSON, int argc, char **argv, char **azColName){
   string* all_admins_JSON = (string*)_all_admins_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   int i;
   for(i = 0; i < argc; i++){
       bool isPassOrToken = strcmp(azColName[i], "token") == 0 || strcmp(azColName[i], "password") == 0;
       if(!isPassOrToken){
           writer.Key(azColName[i]);
           if(argv[i] != NULL){
               writer.String(argv[i]);
           }else{
               writer.String("");
           }
       }
   }
   writer.EndObject();
   all_admins_JSON->append(s.GetString());
   all_admins_JSON->append(",");
   return 0;
}

string getAdmins(){
    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        string query = "SELECT * FROM TABLE_NAME";
        query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
        
        string all_admins_JSON = "[";
        sqlite3_exec(db, query.c_str(), getAdminsExecCallBack, &all_admins_JSON, NULL);
        all_admins_JSON.pop_back();
        all_admins_JSON.append("]");

        return all_admins_JSON;
    }else{
        return "DATABASE_ERROR_OCCURED";
    }
}

// Accepts a JSON data for Add Admin and then deserializes that
// JSON data to the fields below in the class
class EditAdmin{
    public:
        //string full_name;
        //string username;
        //string email;
        //string password;
        //string gender;
        //DOB dob;
        //Image image;
};
#endif
