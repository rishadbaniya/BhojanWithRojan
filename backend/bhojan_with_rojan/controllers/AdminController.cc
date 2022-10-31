#include "AdminController.h"
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>
#include <sqlite3.h>

using namespace std;
using namespace rapidjson;

const string DB_NAME = "./test.db";
const string ADMIN_TABLE = "admin";

typedef struct {
    int month;
    int year;
    int day;
} DOB;

typedef struct {
    string image_data;
    string file_name;
} Image;

// Accepts a JSON data for Add Admin and then deserializes that
// JSON data to the fields below in the class
class AddAdminData{

    public:
        string username;
        string email;
        string password;
        string gender;
        DOB dob;
        Image image;
         
        AddAdminData(const char* req_json){
            // Maps all the JSON data into the struct, simply put, it deserializes everything
            Document doc;
            doc.Parse(req_json); // NOTE : WRONG COMPILER ERROR FROM CCLS
            this->username = doc["username"].GetString();
            this->email = doc["email"].GetString();
            this->password = doc["password"].GetString();
            this->gender = doc["gender"].GetString();
            //const Value& dob_data = doc["DOB"];

            //DOB dob;
            //dob.day = dob_data["day"].GetInt();
            //dob.month = dob_data["month"].GetInt();
            //dob.year = dob_data["year"].GetInt();
            //this->dob = dob;

            //Image image;
            //image.image_data = doc["image_data"].GetString();
            //image.file_name = doc["file_name"].GetString();
            //this->image = image;
        }

        // Tries to add the new user to the database and returns true if succes
        bool addToDatabase(){

            sqlite3* db;
            int isConnected = sqlite3_open(DB_NAME.c_str(), &db);

            char* abc[1000];
            if(isConnected == SQLITE_OK){
                string query = "INSERT INTO TABLE_NAME "
                 "VALUES ('USERNAME', 'EMAIL', 'PASSWORD', 'M' ,NULL, NULL)";
                query.replace(query.find("TABLE_NAME"), strlen("TABLE_NAME"), ADMIN_TABLE);
                query.replace(query.find("USERNAME"), strlen("USERNAME"), username);
                query.replace(query.find("EMAIL"), strlen("EMAIL"), username);
                query.replace(query.find("PASSWORD"), strlen("PASSWORD"), username);

                cout << query << std::endl;

                //string query = "INSERT INTO " + ADMIN_TABLE + " VALUES (" + username + "," + email + "," + password + "," + gender + "," + "NULL" + "," + "NULL" ;
                sqlite3_exec(db, query.c_str(), NULL, 0, abc);
                cout << *abc << endl;
                sqlite3_close(db);
                return true;
            }else{
                // Can't add to the database and returns false
                return false;
            }

        }
};

// Admin URL Paths For Post Request
const string ADMIN_LOGIN = "/admin_login";
const string ADD_ADMIN = "/add_admin";
const string EDIT_ADMIN = "/edit_admin";
const string ADD_USER = "/add_user";
const string EDIT_USER = "/edit_user";
const string ADD_STAFF = "/add_staff";
const string EDIT_STAFF = "/edit_staff";
const string ADD_EDIT_FOOD = "/add_edit_food";

void AdminController::asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback){ 
    auto resp= drogon::HttpResponse::newHttpResponse(); // WRONG COMPILER ERROR
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_TEXT_PLAIN);

    if(req->path() == ADMIN_LOGIN){
    }else if(req->path() == ADD_ADMIN){
        AddAdminData admin_data = AddAdminData(req->bodyData());
        resp->setBody(admin_data.addToDatabase() ? "1" : "0");
    }else if(req->path() == EDIT_ADMIN){
        std::cout << "edit admin" << std::endl;
    }else if(req->path() == ADD_USER){
        std::cout << "add user" << std::endl;
    }else if(req->path() == EDIT_USER){
        std::cout << "edit usrr" << std::endl;
    }else if(req->path() == ADD_STAFF){
        std::cout << "add staff" << std::endl;
    }else if(req->path() == EDIT_STAFF){
        std::cout << "edit staff" << std::endl;
    }else if(req->path() == ADD_EDIT_FOOD){
        std::cout << "add edit food" << std::endl;
    }else{
        resp->setBody("BAD_REQUEST");
    }
    callback(resp);
}


