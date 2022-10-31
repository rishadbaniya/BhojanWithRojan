#include "AdminController.h"
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
    if(req->path() == ADMIN_LOGIN){
        std::cout << "You tried to login" << std::endl;
    }else if(req->path() == ADD_ADMIN){
        std::cout << "add admin" << std::endl;
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

    auto resp= drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_APPLICATION_JSON);
    resp->setBody("{\"token\" : \"alsfjlsjdf\"}\"");
    callback(resp);
}


