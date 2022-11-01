#pragma once
#ifndef _ADMINLOGIN_H_
#define _ADMINLOGIN_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"

using namespace rapidjson;
using namespace std;

int admin_login_sqlite_exec_callback(void* _doesItMatch, int argc, char **argv, char **azColName){
   bool* doesItMatch = (bool*)_doesItMatch;
   *doesItMatch = argc > 0;
   return 0;
}

class AdminLogin{
    public:
        string username; // Username in plain text
        string password; // Password in hex encoded sha256 hash
        AdminLogin(const char* req_json){
             // Maps all the JSON data into the struct, simply put, it deserializes everything
             Document doc;
             doc.Parse(req_json); 
             this->username = doc["username"].GetString();
             this->password = doc["password"].GetString();
        }

        /* It consumes the username and password from the object itself
         * and then makes a query trying to get the row with matching column value of username
         * and if the username matches then a token is returned in "token" variable and 
         * if not then "token" variable is going to contain the password itself
         */
         bool doesCredentialMatch(sqlite3* db){
             string query = "SELECT username, password FROM TABLE_NAME WHERE username='USERNAME' AND password='PASSWORD'";
             query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
             query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
             query.replace(query.find("PASSWORD"), strlen("PASSWORD"), password);
            
             bool doesItMatch = false;
             sqlite3_exec(db, query.c_str(), admin_login_sqlite_exec_callback, &doesItMatch, NULL);
             return doesItMatch;
         }
        
         
         string generateToken(sqlite3* db){
             string TOKEN = "A_TOKEN_OF_LOGIN_LOVE";
             string query = "UPDATE TABLE_NAME SET token = 'TOKEN' WHERE username='USERNAME' AND password='PASSWORD'";
             query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
             query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
             query.replace(query.find("PASSWORD"), strlen("PASSWORD"), password);
             query.replace(query.find("TOKEN"), strlen("TOKEN"), TOKEN);
            
             cout << query << endl;
             sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
             return TOKEN;
         }

         /* On success, it returns a token, which can be then used to login,
          * on error, it returns the information of the error
          */
         string login(){
             sqlite3* db;
             int isConnected = sqlite3_open(DB.c_str(), &db);
             if(isConnected == SQLITE_OK){
                 if(doesCredentialMatch(db)){
                     string TOKEN = generateToken(db);
                     return TOKEN;
                 }else{
                     sqlite3_close(db);
                     return "WRONG_USERNAME_OR_PASS";
                 }
             }else{
                 sqlite3_close(db);
                 // Can't add to the database and returns false
                 return "DATABASE_ERROR_OCCURED";
             }
         }
};

#endif
