#include "UserController.h"
#include <iostream>
#include <sqlite3.h>
#include "AdminController.h"
#include "../libs/rapidjson/document.h"
#include "../libs/rapidjson/writer.h"
#include "../libs/rapidjson/stringbuffer.h"
#include "../components/UserLogin.h"
#include "../components/UserFood.h"
#include "../components/TransferBalance.h"
#include "../components/ChangePassword.h"
#include "../components/UserPay.h"
#include "../components/DailyUsage.h"

using namespace std;
using namespace rapidjson;

const string USER_LOGIN = "/user_login"; // Used to authenticate user for log in ✅
const string CHANGE_PASSWORD = "/change_password"; // Used to change the password of the user 
const string GET_USER_INFO = "/user_info"; // Used to get the metadata about the user, in order to see the balance, see photo, see name et
const string GET_FOOD_CATEGORY = "/get_food_categories";// ✅
const string GET_FOODS= "/get_user_foods";// ✅  
const string TRANSFER_BALANCE = "/transfer_balance";
const string PAY_FOOD = "/pay_food";
const string GET_DAILY_USAGE = "/get_daily_usage";

void UserController::asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) {
    auto resp = drogon::HttpResponse::newHttpResponse(); 
    resp->setStatusCode(k200OK);
    resp->setContentTypeCode(CT_TEXT_PLAIN);
    
    // /admin_login
    if(req->path() == USER_LOGIN){
        // Possible replies from the endpoint /admin_login are :
        // - "WRONG_USERNAME_OR_PASS"
        // - "DATABASE_ERROR_OCCURED"
        // - The token which implies that login was successful
        UserLogin user_login = UserLogin(req->bodyData());
        resp->setBody(user_login.login());
    }else if(req->path() == GET_FOOD_CATEGORY){
        string categories = getFoodCategories();
        cout << categories << endl;
        resp->setBody(categories);

    }else if(req->path() == GET_FOODS){
        string foods = getFoods(req->bodyData());
        cout << foods << endl;
        resp->setBody(foods);
    }else if(req->path() == TRANSFER_BALANCE){
        TransferBalance transfer_balance = TransferBalance(req->bodyData());
        resp->setBody(transfer_balance.transfer());
    }else if(req->path() == CHANGE_PASSWORD){
        ChangePassword change_password = ChangePassword(req->bodyData());
        resp->setBody(change_password.change());
    }else if(req->path() == GET_DAILY_USAGE){
        DailyUsage daily_usage = DailyUsage(req->bodyData());
        cout << "GOT HERE TOO " << endl;
        resp->setBody(daily_usage.getTransactionHistory());
    }else if(req->path() == PAY_FOOD){
        UserPay userpay = UserPay(req->bodyData());
        resp->setBody(userpay.addToQueue());
    }else{

        resp->setBody("BAD_REQUEST");
    }
    callback(resp);
}
