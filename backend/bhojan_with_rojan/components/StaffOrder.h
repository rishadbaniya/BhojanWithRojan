#ifndef _STAFFORDER_H_
#define _STAFFORDER_H_

#include <iostream>
#include "utils.h"
#include <sqlite3.h>
#include <time.h>
#include <chrono>
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"

using namespace rapidjson;
using namespace std;

int getOrdersExecCallBack(void* _all_orders_JSON, int argc, char **argv, char **azColName){
   string* all_orders_JSON = (string*)_all_orders_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   int i;
   for(i = 0; i < argc; i++){
        writer.Key(azColName[i]);
        writer.String(argv[i]);
   }
   writer.EndObject();
   all_orders_JSON->append(s.GetString());
   all_orders_JSON->append(",");
   return 0;
}


int getTransactionHistorycallback(void* _transactionHistory, int argc, char **argv, char **azColName){
   string* transaction_history = (string*)_transactionHistory;
   if(argv[0] != nullptr){
        *transaction_history = argv[0];
   }
   return 0;
}

int getBalanceallback(void* _balance, int argc, char **argv, char **azColName){
   int* balance = (int*)_balance;

   string __balance(argv[0]);
   *balance = stoi(__balance);
   return 0;
}

// Gets the epoch time, which is later on used to create a random token
string _get_epoch_time(){
    const auto now = chrono::system_clock::now();
    const auto epoch =  now.time_since_epoch();
    const auto second =  chrono::duration_cast<chrono::seconds>(epoch);
    long long int a = second.count();
    return to_string(a);
}

class StaffOrder{
    private : 
        string operation;
        int id;
        string bill;
        int total_amount;
    public:
        /* {
         *   "operation" : "GET_ORDERS" | "DELETE_ORDER" | "COMPLETE_ORDER",
         *   "id" : XXXX, (if it's delete order or complete order then only the id is needed)
         *   "bill" : BILL (Just for delete order and complete order)
         * }
         *
         */
        StaffOrder(const char* req){
             Document doc;
             doc.Parse(req); 
             operation = doc["operation"].GetString();
             if(operation != "GET_ORDERS"){
                this->id = doc["id"].GetInt();
                this->bill = doc["bill"].GetString();
                this->total_amount = doc["total_amount"].GetInt();
             }
        }

        int getCurrentBalance(sqlite3* db){
              string query = "SELECT balance from TABLE_NAME where id='ID'";
              query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
              query.replace(query.find("ID"), strlen("ID"), to_string(id));
              int balance;
              sqlite3_exec(db, query.c_str(), getBalanceallback, &balance, NULL);
              return balance;
        }

        void setNewBalance(sqlite3* db, int new_balance){
              string query = "UPDATE TABLE_NAME SET balance = NEW_BALANCE where id='ID'";
              query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
              query.replace(query.find("NEW_BALANCE"), strlen("NEW_BALANCE"), to_string(new_balance));
              query.replace(query.find("ID"), strlen("ID"), to_string(id));

              sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
        }

        void completeOrDeleteOrder(){
          sqlite3* db;
          int isConnected = sqlite3_open(DB.c_str(), &db);
          if(isConnected == SQLITE_OK){
            if(operation == "COMPLETE_ORDER"){
              // Get current balance
              int balance = getCurrentBalance(db);

              // Create new balance by deducting the bill amount
              int new_balance = balance - total_amount;

              // Set the new balance
              setNewBalance(db, new_balance);

              //Update the transaction history with new old balance, new balance and the bill of the transaction
              saveToTransactionHistory(db, balance, new_balance);
            }
            //deleteOrder(db);
          }
        }

        void saveToTransactionHistory(sqlite3* db, int balance_bef, int balance_after){
            string query = "SELECT transaction_history from TABLE_NAME where id='ID'";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
            query.replace(query.find("ID"), strlen("ID"), to_string(id));

            string transaction_history = "";
            sqlite3_exec(db, query.c_str(), getTransactionHistorycallback, &transaction_history, NULL);
            string epoch_time = _get_epoch_time();
            string transaction = "{"
                                 " \"transaction\" : \"BUY\","
                                 " \"date\" : \"EPOCH_TIME\","
                                 " \"bill\" : \"BILL\","
                                 " \"balance_before\" : BALANCE_BEFORE,"
                                 " \"balance_after\" : BALANCE_AFTER"
                                 "}";
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
            sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);

        }

        void deleteOrder(sqlite3* db){
            string query = "DELETE FROM TABLE_NAME WHERE user_id = ID AND items = 'BILL'";
            query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), QUEUE_TABLE);
            query.replace(query.find("ID"), strlen("ID"), to_string(id));
            query.replace(query.find("BILL"), strlen("BILL"), bill);
              
            sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);
        }

        string getOrders(){
             sqlite3* db;
             int isConnected = sqlite3_open(DB.c_str(), &db);
             if(isConnected == SQLITE_OK){
                  string query = "SELECT * FROM TABLE_NAME";
                  query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), QUEUE_TABLE);

                  string all_orders_JSON = "[";
                  sqlite3_exec(db, query.c_str(), getOrdersExecCallBack, &all_orders_JSON, NULL);
                  if(all_orders_JSON.length() > 1){
                      all_orders_JSON.pop_back();
                  }

                  sqlite3_close(db);
                  all_orders_JSON.append("]");
                  return all_orders_JSON;

             }else{
                 sqlite3_close(db);
                 // Can't add to the database and returns false
                 return "DATABASE_ERROR_OCCURED";
             }
      }
};

#endif

