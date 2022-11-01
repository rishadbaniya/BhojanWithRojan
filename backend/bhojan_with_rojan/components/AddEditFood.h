#pragma once
#ifndef _ADDADMIN_H_
#define _ADDADMIN_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"

using namespace rapidjson;
using namespace std;

int sqlite_exec_callback(void* isUsernameTaken, int argc, char **argv, char **azColName){
   bool* isTaken = (bool*)isUsernameTaken;

   int i;
   for(i = 0; i < argc; i++){
       *isTaken = true;
   }
   return 0;
}

// Accepts a JSON data for Add Admin and then deserializes that
// JSON data to the fields below in the class
class AddAdmin{
    public:
        string username;
        string email;
        string password;
        string gender;
        DOB dob;
        Image image;
         
        AddAdmin(const char* req_json){

             // Maps all the JSON data into the struct, simply put, it deserializes everything
             Document doc;
             doc.Parse(req_json); // NOTE : WRONG COMPILER ERROR FROM CCLS
             this->username = doc["username"].GetString();
             this->email = doc["email"].GetString();
             this->password = doc["password"].GetString();
             this->gender = doc["gender"].GetString();
             const Value& dob_data = doc["DOB"];

             DOB dob;
             dob.day = dob_data["day"].GetInt();
             dob.month = dob_data["month"].GetInt();
             dob.year = dob_data["year"].GetInt();
             this->dob = dob;

             //Image image;
             //image.image_data = doc["image_data"].GetString();
             //image.file_name = doc["file_name"].GetString();
             //this->image = image;
        }


         // Checks if any admin exists with given username
         bool isUsernameTaken(const char* username, sqlite3* db){
             string query = "SELECT username FROM TABLE_NAME WHERE username='USERNAME'";
             query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
             query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
         
             bool isUserNameTaken = false;
             sqlite3_exec(db, query.c_str(), sqlite_exec_callback, &isUserNameTaken, NULL);
             return isUserNameTaken;
         
         }

         // Tries to add the new user to the database and returns true if succes
         int addToDatabase(){
             // In order to add any new admin to the database, one must check if a admin with same username
             // exists there in the database already or not
             //
             // If an admin with same username exists there on the database then one must respond with error to
             // the client
         
             sqlite3* db;
             int isConnected = sqlite3_open(DB.c_str(), &db);
             if(isConnected == SQLITE_OK){
                 if(!isUsernameTaken(username.c_str(), db)){
                     cout << "The username was not taken" << endl;
                     string query = "INSERT INTO TABLE_NAME VALUES ('USERNAME', 'EMAIL', 'PASSWORD', 'GENDER' ,'DOB', 'IMAGE_PATH')";
                     query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
                     query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
                     query.replace(query.find("EMAIL"), strlen("EMAIL"), username);
                     query.replace(query.find("PASSWORD"), strlen("PASSWORD"), username);
                     query.replace(query.find("GENDER"), strlen("GENDER"), gender);
                     query.replace(query.find("DOB"), strlen("DOB"), gender);
                     query.replace(query.find("IMAGE_PATH"), strlen("IMAGE_PATH"), gender);
         
                     //string query = "INSERT INTO " + ADMIN_TABLE + " VALUES (" + username + "," + email + "," + password + "," + gender + "," + "NULL" + "," + "NULL" ;
                     sqlite3_exec(db, query.c_str(), NULL, 0, NULL);
                     //cout << *abc << endl;
                     sqlite3_close(db);
                     return OK;
                 }else{
                     sqlite3_close(db);
                     cout << "The username was taken" << endl;
                     return ERR_ADMIN_USERNAME_WAS_TAKEN;
                 }
             }else{
                 sqlite3_close(db);
                 // Can't add to the database and returns false
                 return ERR_DATABASE_ERROR_OCCURED;
             }
         
         }
};
#endif
