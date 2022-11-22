#ifndef _USERPAY_H_
#define _USERPAY_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../libs/picosha2.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h" 

using namespace std;
using namespace rapidjson;

class UserPay{
    private :
        string req;
        string id;
    public : 
        UserPay(const char* req_json){
            req = string(req_json);
            id = req.substr(0, req.find("["));
            req = req.substr(req.find("["));
        }
        
        string addToQueue(){
            sqlite3* db;
            int isConnected = sqlite3_open(DB.c_str(), &db);
            if(isConnected == SQLITE_OK){
               createQueueTableIfNotExist(db);
                string query = "INSERT INTO TABLE_NAME VALUES (ID, 'ITEMS')";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), QUEUE_TABLE);
                query.replace(query.find("ID"), strlen("ID"), id);
                query.replace(query.find("ITEMS"), strlen("ITEMS"), req);
                sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
                return "OK";
            }else{
                return "DATABASE_ERROR_OCCURED";
            }
        }

        void createQueueTableIfNotExist(sqlite3* db){
            string query = "CREATE TABLE IF NOT EXISTS TABLE_NAME (user_id TEXT, items TEXT)";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), QUEUE_TABLE);
            sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
        }
};
#endif
