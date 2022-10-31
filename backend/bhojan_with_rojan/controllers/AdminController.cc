#include "AdminController.h"
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include <iostream>

using namespace std;
using namespace rapidjson;

typedef struct {
    int month;
    int year;
    int day;
} DOB;

typedef struct {
    string image_data;
    string file_name;
} Image;

class AddAdminData{
    public:
        string username;
        string email;
        string password;
        string gender;
        DOB dob;
        Image image;

        AddAdminData(const char* req_json){
            Document doc;
            doc.Parse(req_json); // WRONG COMPILER ERROR
            this->username = doc["username"].GetString();
            this->email = doc["email"].GetString();
            this->password = doc["password"].GetString();

        }

        // Tries to add the new user to the database and returns true if succes
        bool addToDatabase(){
            return 1;
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
    if(req->path() == ADMIN_LOGIN){
        
    }else if(req->path() == ADD_ADMIN){
        AddAdminData admin_data = AddAdminData(req->bodyData());
        cout << admin_data.email;

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
    }

    auto resp= drogon::HttpResponse::newHttpResponse(); // WRONG COMPILER ERROR
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_APPLICATION_JSON);
    resp->setBody("{\"token\" : \"alsfjlsjdf\"}\"");
    callback(resp);
}


