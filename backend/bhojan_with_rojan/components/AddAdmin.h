#pragma once
#ifndef _ADDADMIN_H_
#define _ADDADMIN_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include <fstream>
#include <filesystem>
#include <string.h>
#include "utils.h"
#include "../libs/base64.h"

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
        string full_name;
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
             this->full_name = doc["full_name"].GetString();
             this->username = doc["username"].GetString();
             this->email = doc["email"].GetString();
             this->password = doc["password"].GetString();
             this->gender = doc["gender"].GetString();
             const Value& dob_data = doc["DOB"];

             DOB dob;
             dob.day = dob_data["day"].GetString();
             dob.month = dob_data["month"].GetString();
             dob.year = dob_data["year"].GetString();
             this->dob = dob;

             Image image;
             image.image_data = doc["image_data"].GetString();
             image.file_name = doc["file_name"].GetString();
             this->image = image;
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
                     string image_path = createAndSaveBase64Image(image.file_name, image.image_data, username);
                     string _dob = "";
                     _dob.append(dob.year);
                     _dob.append("-");
                     _dob.append(dob.month);
                     _dob.append("-");
                     _dob.append(dob.day);

                     string query = "INSERT INTO TABLE_NAME VALUES ('USERNAME', 'EMAIL', 'PASSWORD', 'GENDER' ,'DOB', 'IMAGE_PATH', 'TOKEN')";
                     query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
                     query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
                     query.replace(query.find("EMAIL"), strlen("EMAIL"), email);
                     query.replace(query.find("PASSWORD"), strlen("PASSWORD"), password);
                     query.replace(query.find("GENDER"), strlen("GENDER"), gender);
                     query.replace(query.find("DOB"), strlen("DOB"), _dob);
                     query.replace(query.find("IMAGE_PATH"), strlen("IMAGE_PATH"), image_path);
                     query.replace(query.find("TOKEN"), strlen("TOKEN"), "");
         
                     char* abc[1000];
                     sqlite3_exec(db, query.c_str(), NULL, 0, abc);
                     cout << *abc << endl;
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
        
         // Gets the base64 encoded string and name of the file, then creates the image file, returning the path of the file stored
         // relative to the webserver that's running, so that it c
         string createAndSaveBase64Image(string name, string image_base64, string username){
             // The path fo the admin image that should be in is 
             // "./admin_pics/username.jpg"
             string _path = name.substr(name.find('.'));
             _path.insert(0, username);
             _path.insert(0, "admin_");
             ofstream file_stream;
             file_stream.open(_path);
             file_stream << base64_decode(image_base64);
             file_stream.close();
             return _path;
         }
};

#endif
