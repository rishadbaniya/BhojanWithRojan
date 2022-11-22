#pragma once
#ifndef _DAILY_USAGE_H
#define _DAILY_USAGE_H

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../libs/picosha2.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h" 
#include <time.h>
#include <chrono>

using namespace std;
using namespace rapidjson;

int __getTransactionHistorycallback(void* _transactionHistory, int argc, char **argv, char **azColName){
   string* transaction_history = (string*)_transactionHistory;
   if(argv[0] != nullptr){
        *transaction_history = argv[0];
   }
   return 0;
}

class DailyUsage{
    public:
        int id;

        DailyUsage(const char* req_json){
            id = stoi(string(req_json));
        }

        string getTransactionHistory(){
           sqlite3* db;
           int isConnected = sqlite3_open(DB.c_str(), &db);
           if(isConnected == SQLITE_OK){
                string query = "SELECT transaction_history from TABLE_NAME where id='ID'";
                 query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
                 query.replace(query.find("ID"), strlen("ID"), to_string(id));

                 string transaction_history = "";
                 sqlite3_exec(db, query.c_str(),__getTransactionHistorycallback, &transaction_history, NULL);
                 sqlite3_close(db);

                 cout << transaction_history <<endl;
                 return transaction_history;
           }else{
               sqlite3_close(db);
               return "DATABASE_ERROR_OCCURED";
           }
        }
};
#endif
