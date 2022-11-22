#pragma once
#ifndef _EDITADMIN_H_
#define _EDITADMIN_H_

#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"
#include <string.h>
#include <filesystem>

using namespace std;
using namespace rapidjson;

//Callback to be called after the admins are retrieved from the database
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

// Used to get admins
string getAdmins(){
    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        string query = "SELECT * FROM TABLE_NAME";
        query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
        
        string all_admins_JSON = "[";
        sqlite3_exec(db, query.c_str(), getAdminsExecCallBack, &all_admins_JSON, NULL);
        if(all_admins_JSON.length() > 1){
            all_admins_JSON.pop_back();
        }
        all_admins_JSON.append("]");
        sqlite3_close(db);
        return all_admins_JSON;
    }else{
        return "DATABASE_ERROR_OCCURED";
    }
}

int deleteAdminExecCallBack(void* x, int argc, char **argv, char **azColName){
    cout << argv[0] << endl;
    remove(argv[0]);
    return 0;
}

// Used to delete the given username'd admin from the Database
string deleteAdmin(string username){
    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        // Delete the admin's image
        string query_1 = "SELECT image_url FROM TABLE_NAME WHERE username='USERNAME'";
        query_1.replace(query_1.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
        query_1.replace(query_1.find("USERNAME"), strlen("USERNAME"), username);
        cout << query_1 << endl;
        sqlite3_exec(db, query_1.c_str(), deleteAdminExecCallBack, NULL, NULL );
        
        // Delete the admin data
        string query_2 = "DELETE FROM TABLE_NAME WHERE username='USERNAME'";
        query_2.replace(query_2.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
        query_2.replace(query_2.find("USERNAME"), strlen("USERNAME"), username);
        sqlite3_exec(db, query_2.c_str(), NULL, NULL, NULL);
        sqlite3_close(db);
        return "OK";
    }else{
        return "DATABASE_ERROR_OCCURED";
    }
}

// Accepts a JSON data for Add Admin and then deserializes that
// JSON data to the fields below in the class
class EditAdmin{
    public:
        string full_name;
        string username;
        string email;
        string password;
        string gender;
        DOB dob;
        Image image;
};
#endif
