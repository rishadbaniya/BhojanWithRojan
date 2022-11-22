#include <iostream>
#include <sqlite3.h>
#include "StaffController.h"
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../components/StaffOrder.h"

using namespace std;

void StaffController::asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback){ 

    auto resp= drogon::HttpResponse::newHttpResponse(); 
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_TEXT_PLAIN);
    
    // /admin_login
    if(req->path() == STAFF_LOGIN){
        // Possible replies from the endpoint /admin_login are :
        // - "WRONG_USERNAME_OR_PASS"
        // - "DATABASE_ERROR_OCCURED"
        // - The token which implies that login was successful
     //   AdminLogin admin_login = AdminLogin(req->bodyData());
     //   string login = admin_login.login();
     //   if(login == "WRONG_USERNAME_OR_PASS"){
     //       resp->setBody("WRONG_USERNAME_OR_PASS");
     //   }else if(login == "DATABASE_ERROR_OCCURED"){
     //       resp->setBody("DATABASE_ERROR_OCCURED");
     //   }else{
     //       resp->setBody(login);
     //   }
    
    }else if(req->path() == GET_ORDERS){

        StaffOrder staff_order = StaffOrder(req->bodyData());
        resp->setBody(staff_order.getOrders());
    }else if(req->path() == DELETE_OR_COMPLETE_ORDER){
        cout << "CAME HERE" << endl;
        StaffOrder staff_order = StaffOrder(req->bodyData());
        staff_order.completeOrDeleteOrder();
        resp->setBody("OK");
    }else{
        resp->setBody("BAD_REQUEST");
    }

    callback(resp);
}


