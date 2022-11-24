#pragma once
#ifndef _EDITUSER_H_
#define _EDITUSER_H_

#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h"
#include <time.h>
#include <chrono>
#include <string.h>
#include <filesystem>

using namespace std;
using namespace rapidjson;

void __saveToTransactionHistory(sqlite3* db, int balance_bef, int balance_after, int id);

string ___get_epoch_time(){
    const auto now = chrono::system_clock::now();
    const auto epoch =  now.time_since_epoch();
    const auto second =  chrono::duration_cast<chrono::seconds>(epoch);
    long long int a = second.count();
    return to_string(a);
}

int ___getTransactionHistorycallback(void* _transactionHistory, int argc, char **argv, char **azColName){
   string* transaction_history = (string*)_transactionHistory;
   if(argv[0] != nullptr){
        *transaction_history = argv[0];
   }
   return 0;
}

//Callback to be called after the admins are retrieved from the database
int getUsersCallback(void* _all_users_JSON, int argc, char **argv, char **azColName){
   string* all_users_JSON = (string*)_all_users_JSON;
   StringBuffer s;
   Writer<StringBuffer> writer(s);
   writer.StartObject();
   int i;
   for(i = 0; i < argc; i++){
       bool isPassOrToken = strcmp(azColName[i], "token") == 0 || strcmp(azColName[i], "password") == 0 || strcmp(azColName[i], "transaction_history") == 0;
       if(!isPassOrToken){
           writer.Key(azColName[i]);
           if(argv[i] != NULL){
               writer.String(argv[i]);
           }else{
               writer.String("");
           }
       }
   }
   writer.EndObject();
   all_users_JSON->append(s.GetString());
   all_users_JSON->append(",");
   return 0;
}

// Used to get users
string getUsers(){
    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        string query = "SELECT * FROM TABLE_NAME";
        query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
        string all_users_JSON = "[";
        sqlite3_exec(db, query.c_str(), getUsersCallback, &all_users_JSON, NULL);
        if(all_users_JSON.length() > 1){
            all_users_JSON.pop_back();
        }
        all_users_JSON.append("]");
        sqlite3_close(db);
        return all_users_JSON;
    }else{
        return "DATABASE_ERROR_OCCURED";
    }
}

int deleteUserExecCallBack(void* x, int argc, char **argv, char **azColName){
    cout << argv[0] << endl;
    remove(argv[0]);
    return 0;
}

// Used to delete the given id user from the Database
string deleteUser(int id){
    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        // Delete the user's image
        string query_1 = "SELECT image_path FROM TABLE_NAME WHERE id = 'ID'";
        query_1.replace(query_1.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
        query_1.replace(query_1.find("ID"), strlen("ID"), to_string(id));
        cout << query_1 << endl;
        sqlite3_exec(db, query_1.c_str(), deleteUserExecCallBack, NULL, NULL );
        
        // Delete the admin data
        string query_2 = "DELETE FROM TABLE_NAME WHERE id='ID'";
        query_2.replace(query_2.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
        query_2.replace(query_2.find("ID"), strlen("ID"), to_string(id));
        sqlite3_exec(db, query_2.c_str(), NULL, NULL, NULL);
        sqlite3_close(db);
        return "OK";
    }else{
        return "DATABASE_ERROR_OCCURED";
    }
}


string editBalance(string data){
    cout << data << endl;
    int id = stoi(data.substr(0, data.find(',')));

    data = data.substr(data.find(',') + 1);
    int oldBalance = stoi(data.substr(0, data.find(',')));

    data = data.substr(data.find(',') + 1);
    int newBalance = stoi(data.substr(data.find(',') + 1));

    sqlite3* db;
    int isConnected = sqlite3_open(DB.c_str(), &db);
    if(isConnected == SQLITE_OK){
        string query = "UPDATE TABLE_NAME set balance = BALANCE where id = 'ID'";
        query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
        query.replace(query.find("BALANCE"), strlen("BALANCE"), to_string(newBalance));
        query.replace(query.find("ID"), strlen("ID"), to_string(id));

        sqlite3_exec(db, query.c_str(), NULL, NULL, NULL);

        __saveToTransactionHistory(db, oldBalance, newBalance, id);

        sqlite3_close(db);

    }
    return "OK";
}


void __saveToTransactionHistory(sqlite3* db, int balance_bef, int balance_after, int id){
    string query = "SELECT transaction_history from TABLE_NAME where id='ID'";
    query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
    query.replace(query.find("ID"), strlen("ID"), to_string(id));

    string transaction_history = "";
    cout << query<< endl;
    sqlite3_exec(db, query.c_str(), ___getTransactionHistorycallback, &transaction_history, NULL);
    string epoch_time = ___get_epoch_time();
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

#endif
