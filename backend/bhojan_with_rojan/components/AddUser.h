
#pragma once
#ifndef _ADDUSER_H_
#define _ADDUSER_H

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <fstream>
#include <filesystem>
#include <string.h>
#include <sqlite3.h>
#include "utils.h"
#include "../libs/base64.h"
#include "../libs/base64.cpp"

using namespace rapidjson;
using namespace std;

string ____get_epoch_time(){
    const auto now = chrono::system_clock::now();
    const auto epoch =  now.time_since_epoch();
    const auto second =  chrono::duration_cast<chrono::seconds>(epoch);
    long long int a = second.count();
    return to_string(a);
}

int ____getTransactionHistorycallback(void* _transactionHistory, int argc, char **argv, char **azColName){
   string* transaction_history = (string*)_transactionHistory;
   if(argv[0] != nullptr){
        *transaction_history = argv[0];
   }
   return 0;
}

void ___saveToTransactionHistory(sqlite3* db, int balance_bef, int balance_after, int id){
    string query = "SELECT transaction_history from TABLE_NAME where id='ID'";
    query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
    query.replace(query.find("ID"), strlen("ID"), to_string(id));

    string transaction_history = "";
    cout << query<< endl;
    sqlite3_exec(db, query.c_str(), ____getTransactionHistorycallback, &transaction_history, NULL);
    string epoch_time = ____get_epoch_time();
    string transaction = "{"
                         " \"transaction\" : \"TRANSFER_IN\","
                         " \"date\" : \"EPOCH_TIME\","
                         " \"bill\" : \"BILL\","
                         " \"balance_before\" : BALANCE_BEFORE,"
                         " \"balance_after\" : BALANCE_AFTER"
                         "}";
    
    string bill = "";
        bill = "From : admin" ;
        bill.append(" , Amount : ");
        bill.append(to_string(balance_after - balance_bef));

    transaction.replace(transaction.find("EPOCH_TIME"), strlen("EPOCH_TIME"), epoch_time);
    transaction.replace(transaction.find("BILL"), strlen("BILL"), bill);
    transaction.replace(transaction.find("BALANCE_BEFORE"), strlen("BALANCE_BEFORE"), to_string(balance_bef));
    transaction.replace(transaction.find("BALANCE_AFTER"), strlen("BALANCE_AFTER"), to_string(balance_after));
    
    if(transaction_history.length() > 2){
       transaction_history.append(",");
    }

    transaction_history.append(transaction);

    query = "UPDATE TABLE_NAME SET transaction_history = 'NEW_HISTORY' where id='ID'";
    query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
    query.replace(query.find("NEW_HISTORY"), strlen("NEW_HISTORY"), transaction_history);
    query.replace(query.find("ID"), strlen("ID"), to_string(id));

    cout << transaction_history << endl;
    auto client = drogon::HttpClient::newHttpClient(PDF_GENERATION_BACKEND);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath("/");

    string body = to_string(id) + transaction_history;

    req->setBody(body);
    client->sendRequest(req);

    sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);

}

string getDOBString(DOB dob){
    string _dob = "";
    _dob.append(dob.year);
    _dob.append("-");
    _dob.append(dob.month);
    _dob.append("-");
    _dob.append(dob.day);
    return _dob;
}

int add_user_sqlite_exec_callback(void* isIdTaken, int argc, char **argv, char **azColName){
   bool* isTaken = (bool*)isIdTaken;

   int i;
   for(i = 0; i < argc; i++){
       *isTaken = true;
   }
   return 0;
}


// Accepts a JSON data for Add Admin and then deserializes that
// JSON data to the fields below in the class
class AddUser{
    public:
        string full_name;
        int id; // if of the user
        string password; // password of the user
        string department; // department of the user(eg. CS, CE)
        string gender; // gender
        string added_by; // username of the admin who added the use
        int balance; // Initial balance of the user

        Image image;
        
        AddUser(const char* req_json){
             // Maps all the JSON data into the struct, simply put, it deserializes everything
             Document doc;
             doc.Parse(req_json); // NOTE : WRONG COMPILER ERROR FROM CCLS
             this->full_name = doc["full_name"].GetString();
             this->id = doc["id"].GetInt();
             this->password = doc["password"].GetString();
             this->department = doc["department"].GetString();
             this->gender = doc["gender"].GetString();
             this->balance = doc["balance"].GetInt();
             this->added_by = doc["added_by"].GetString();

             Image image;
             image.image_data = doc["image_data"].GetString();
             image.file_name = doc["file_name"].GetString();
            this->image = image;
        }

        // Creates table if the table does not exist
        void createUserTableIfNotExist(sqlite3* db){
            string query = "CREATE TABLE IF NOT EXISTS TABLE_NAME("
                    "full_name VARCHAR(50),"
                    "id VARCHAR(50),"
                    "password VARCHAR(50),"
                    "department VARCHAR(50),"
                    "gender VARCHAR(5),"
                    "image_path VARCHAR(100),"
                    "token VARCHAR(100),"
                    "added_by VARCHAR(100),"
                    "balance INTEGER,"
                    "transaction_history TEXT"
                ")";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
            sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
        }

         // Checks if any admin exists with given username
         bool isIdTaken(const char* id, sqlite3* db){
             string query = "SELECT id FROM TABLE_NAME WHERE id='ID'";
             query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
             query.replace(query.find("ID"), strlen("ID"), id);
         
             bool isIDTaken = false;
             sqlite3_exec(db, query.c_str(), add_user_sqlite_exec_callback, &isIDTaken, NULL);
             return isIDTaken;
         }

         // Tries to add the new user to the database and returns true if succes
         string addToDatabase(){
         // In order to add any new admin to the database, one must check if a admin with same username
         // exists there in the database already or not
         //
         // If an admin with same username exists there on the database then one must respond with error to
         // the client
         
          sqlite3* db;
          int isConnected = sqlite3_open(DB.c_str(), &db);
          createUserTableIfNotExist(db);
          if(isConnected == SQLITE_OK){
                if(!isIdTaken(to_string(id).c_str(), db)){
                     string image_path = createAndSaveBase64Image(image.file_name, image.image_data, to_string(id));
                     string query = "INSERT INTO TABLE_NAME VALUES ('FULL_NAME', 'ID', 'PASSWORD', 'DEPARTMENT', 'GENDER' , 'IMAGE_PATH', NULL, NULL, BALANCE, NULL)";
                     query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
                     query.replace(query.find("FULL_NAME"), strlen("FULL_NAME"), full_name);
                     query.replace(query.find("ID"), strlen("ID"), to_string(id));
                     query.replace(query.find("PASSWORD"), strlen("PASSWORD"), password);
                     query.replace(query.find("DEPARTMENT"), strlen("DEPARTMENT"), department);
                     query.replace(query.find("GENDER"), strlen("GENDER"), gender);
                     query.replace(query.find("IMAGE_PATH"), strlen("IMAGE_PATH"), image_path);
                     query.replace(query.find("BALANCE"), strlen("BALANCE"), to_string(balance));
         
                     sqlite3_exec(db, query.c_str(), NULL, 0, NULL);

                     ___saveToTransactionHistory(db, 0, balance, id);
                     sqlite3_close(db);

                     
                     return "OK";
                 }else{
                     sqlite3_close(db);
                     return "USER_ID_WAS_TAKEN";
                 }
             }else{
                 sqlite3_close(db);
                 // Can't add to the database and returns false
                 return "DATABASE_ERROR_OCCURED";
             }
         }


         // Gets the base64 encoded string and name of the file, then creates the image file, returning the path of the file stored
         // relative to the webserver that's running, so that it c
         string createAndSaveBase64Image(string name, string image_base64, string id){
             // The path fo the admin image that should be in is 
             // "./admin_pics/username.jpg"
             string _path = name.substr(name.find('.'));
             _path.insert(0, id);
             _path.insert(0, "user_");
             ofstream file_stream;
             file_stream.open(_path);
             file_stream << base64_decode(image_base64);
             file_stream.close();
             return _path;
         }
};

#endif
