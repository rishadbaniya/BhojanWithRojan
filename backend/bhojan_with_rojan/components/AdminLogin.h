// It handles the data coming to "/admin_login",
// the format for data body that must be constrained while being sent to this end point is,
// a JSON of format as below, with username and hash of the password
//
// "{
//      "username" : "rishad"
//      "password" : "4a09ee55f13f0b861f343fbcecdf0f9c54afece0c28ed570b05d109cdca9cb2a"
// }"

#pragma once
#ifndef _ADMINLOGIN_H_
#define _ADMINLOGIN_H_
#include <chrono>
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../libs/picosha2.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"
#include <time.h>

using namespace rapidjson;
using namespace std;

//  Sqlite exec callback, used to make sure that username and password match
int admin_login_sqlite_exec_callback(void* _doesItMatch, int argc, char **argv, char **azColName){
   bool* doesItMatch = (bool*)_doesItMatch;
   *doesItMatch = argc > 0;
   return 0;
}

// Gets the epoch time, which is later on used to create a random token
string get_epoch_time(){
    const auto now = chrono::system_clock::now();
    const auto epoch =  now.time_since_epoch();
    const auto second =  chrono::duration_cast<chrono::seconds>(epoch);
    long long int a = second.count();
    return to_string(a);
}

// A datastructure to handle everything related to login
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
             // Get as random number as possible
             int random_variable = std::rand();
             string _epoch_time = get_epoch_time().append(to_string(random_variable));
             // Create 256 bit hash of the number, which is used as token for login
             string TOKEN = picosha2::hash256_hex_string(_epoch_time.begin(), _epoch_time.end());
            
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
