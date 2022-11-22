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
#include <time.h>
#include <chrono>

using namespace std;
using namespace rapidjson;

// Gets the epoch time, which is later on used to create a random token
string __get_epoch_time(){
    const auto now = chrono::system_clock::now();
    const auto epoch =  now.time_since_epoch();
    const auto second =  chrono::duration_cast<chrono::seconds>(epoch);
    long long int a = second.count();
    return to_string(a);
}
int _getTransactionHistorycallback(void* _transactionHistory, int argc, char **argv, char **azColName){
   string* transaction_history = (string*)_transactionHistory;
   if(argv[0] != nullptr){
        *transaction_history = argv[0];
   }
   return 0;
}

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

                    // Update the transaction history of own id
                    saveToTransactionHistory(db, OWN_ID_currentBalance, OWN_ID_currentBalance - amount, own_id, "TRANSFER_OUT", to_id, amount);

                    // Update the transaction history of id where the balance was sent
                    saveToTransactionHistory(db, TO_ID_currentBalance, TO_ID_currentBalance + amount, to_id ,"TRANSFER_IN", own_id, amount);
                    

                    
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


        void saveToTransactionHistory(sqlite3* db, int balance_bef, int balance_after, int _own_id, string _transaction, int to_or_from, int amount){
           string query = "SELECT transaction_history from TABLE_NAME where id='ID'";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
            query.replace(query.find("ID"), strlen("ID"), to_string(_own_id));

            string transaction_history = "";
            cout << query<< endl;
            sqlite3_exec(db, query.c_str(), _getTransactionHistorycallback, &transaction_history, NULL);
            string epoch_time = __get_epoch_time();
            string transaction = "{"
                                 " \"transaction\" : \"TRANSACTION\","
                                 " \"date\" : \"EPOCH_TIME\","
                                 " \"bill\" : \"BILL\","
                                 " \"balance_before\" : BALANCE_BEFORE,"
                                 " \"balance_after\" : BALANCE_AFTER"
                                 "}";
            
            string bill = "";
            if(_transaction == "TRANSFER_OUT"){
                bill = "To :";
                bill.append(to_string(to_or_from));
                bill.append(",Amount : ");
                bill.append(to_string(amount));
            }else{
                bill = "From :";
                bill.append(to_string(to_or_from));
                bill.append(",Amount :");
                bill.append(to_string(amount));
            }

            transaction.replace(transaction.find("TRANSACTION"), strlen("TRANSACTION"), _transaction);
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
            query.replace(query.find("ID"), strlen("ID"), to_string(_own_id));

            cout << transaction_history << endl;
            sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);

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
