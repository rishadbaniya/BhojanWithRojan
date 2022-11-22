#pragma once
#ifndef _TRANSFERBALANCE_H_
#define _TRANSFERBALANCE_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../libs/picosha2.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h" 

using namespace std;
using namespace rapidjson;

int getBalanceExecCallBack(void* _balance, int argc, char **argv, char **azColName){
   int* balance = (int*)_balance;
   *balance = stoi(argv[0]);
   return 0;
}

class TransferBalance{
    public:
        int amount;
        int to_id;
        int own_id;
        int new_balance;

        TransferBalance(const char* req_json){
             Document doc;
             doc.Parse(req_json); 
             this->own_id = doc["own_id"].GetInt();
             this->to_id = doc["to_id"].GetInt();
             this->amount = doc["amount"].GetInt();

        }

        string transfer(){
           sqlite3* db;
           int isConnected = sqlite3_open(DB.c_str(), &db);
           if(isConnected == SQLITE_OK){
               int OWN_ID_currentBalance = getCurrentBalanceInId(db, own_id);
               int TO_ID_currentBalance = getCurrentBalanceInId(db, to_id);

               if(OWN_ID_currentBalance == -1 || TO_ID_currentBalance == -1){
                   return "THE ID DOESNT EXIST";
               }else{
                    int remainingAmount = OWN_ID_currentBalance - amount;
                    updateBalanceInId(db, own_id, remainingAmount);
                    updateBalanceInId(db, to_id, TO_ID_currentBalance + amount);

                    string resp = "{ \"balance\" : NEW_BALANCE }";
                    resp.replace(resp.find("NEW_BALANCE"), strlen("NEW_BALANCE"), to_string(remainingAmount));

                    sqlite3_close(db);
                    return resp;
               }

           }else{
               sqlite3_close(db);
               // Can't add to the database and returns false
               return "DATABASE_ERROR_OCCURED";
           }
        }

        int getCurrentBalanceInId(sqlite3* db, int id){
            string query = "SELECT balance from TABLE_NAME where id=ID";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
            query.replace(query.find("ID"),strlen("ID"), to_string(id));

            cout << query << endl;
            int balance = -1;
            sqlite3_exec(db,query.c_str(), getBalanceExecCallBack, &balance, NULL);
            return balance;
        }

        void updateBalanceInId(sqlite3* db,int id, int balance){
            string query = "UPDATE TABLE_NAME SET balance = NEW_BALANCE WHERE id = ID";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
            query.replace(query.find("ID"),strlen("ID"), to_string(id));
            query.replace(query.find("NEW_BALANCE"),strlen("NEW_BALANCE"), to_string(balance));
            sqlite3_exec(db,query.c_str(),NULL, NULL, NULL);
        }
};
#endif
