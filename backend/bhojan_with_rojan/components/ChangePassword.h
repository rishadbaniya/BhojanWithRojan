#pragma once
#ifndef _CHANGEPASSWORD_H_
#define _CHANGEPASSWORD_H_

#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../libs/picosha2.h"
#include <iostream>
#include <sqlite3.h>
#include "utils.h" 

using namespace std;
using namespace rapidjson;

int changePassExecCallBack(void* _doesExist, int argc, char **argv, char **azColName){
   bool* doesExist = (bool*)_doesExist;
   *doesExist = true;
   return 0;
}

class ChangePassword{
    public:

        int id;
        string new_password;
        string old_password;

        ChangePassword(const char* req_json){
             Document doc;
             doc.Parse(req_json); 
             this->id = doc["id"].GetInt();
             this->new_password = doc["new_password"].GetString();
             this->old_password= doc["old_password"].GetString();

             cout << req_json << endl;
        }

        string change(){
           sqlite3* db;
           int isConnected = sqlite3_open(DB.c_str(), &db);
           if(isConnected == SQLITE_OK){
                string query = "UPDATE TABLE_NAME SET password = 'NEW_PASSWORD' WHERE id = ID AND password = 'OLD_PASSWORD'";     
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
                query.replace(query.find("NEW_PASSWORD"), strlen("NEW_PASSWORD"), new_password);
                query.replace(query.find("OLD_PASSWORD"), strlen("OLD_PASSWORD"), old_password);
                query.replace(query.find("ID"), strlen("ID"), to_string((id)));
                

                string query_1 = "SELECT * FROM TABLE_NAME WHERE id = ID AND password = 'OLD_PASSWORD'";
                query_1.replace(query_1.find("TABLE_NAME"), strlen("TABLE_NAME"), USER_TABLE);
                query_1.replace(query_1.find("OLD_PASSWORD"), strlen("OLD_PASSWORD"), old_password);
                query_1.replace(query_1.find("ID"), strlen("ID"), to_string((id)));


                bool doesExist = false;
                sqlite3_exec(db,query_1.c_str(), changePassExecCallBack, &doesExist, NULL);;

                if(doesExist == false){
                    sqlite3_close(db);
                    return "YOUR PASSWORD DOESNT MATCH";
                }else{
                    sqlite3_exec(db,query.c_str(),NULL, NULL, NULL);;
                }

                sqlite3_close(db);
                return "OK";


           }else{
               sqlite3_close(db);
               // Can't add to the database and returns false
               return "DATABASE_ERROR_OCCURED";
           }
        }
};
#endif
