#include "AdminController.h"
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../components/AddAdmin.h"
#include "../components/AdminLogin.h"


#include <iostream>
#include <sqlite3.h>


#include "../components/utils.h"

using namespace std;

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
    auto resp= drogon::HttpResponse::newHttpResponse(); 
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_TEXT_PLAIN);

    if(req->path() == ADMIN_LOGIN){
        AdminLogin admin_login = AdminLogin(req->bodyData());
        string login = admin_login.login();
        if(login == "WRONG_USERNAME_OR_PASS"){
            resp->setBody("WRONG_USERNAME_OR_PASS");
        }else if(login == "DATABASE_ERROR_OCCURED"){
            resp->setBody("DATABASE_ERROR_OCCURED");
        }else{
            resp->setBody(login);
        }
    }else if(req->path() == ADD_ADMIN){
        AddAdmin add_admin = AddAdmin(req->bodyData());
        switch(add_admin.addToDatabase()){
            case ERR_ADMIN_USERNAME_WAS_TAKEN : 
                resp->setBody("USERNAME_WAS_TAKEN");
                break;
            case ERR_DATABASE_ERROR_OCCURED : 
                resp->setBody("DATABASE_ERROR_OCCURED");
                break;
            default : 
                resp->setBody("OK");
                break;
        }
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


