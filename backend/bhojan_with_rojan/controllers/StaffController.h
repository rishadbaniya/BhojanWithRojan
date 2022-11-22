#pragma once
#include <drogon/HttpSimpleController.h>

using namespace drogon;
using namespace std;

const string STAFF_LOGIN = "/admin_login";
const string GET_ORDERS = "/get_orders";
const string DELETE_OR_COMPLETE_ORDER = "/delete_or_complete_order";

class StaffController : public drogon::HttpSimpleController<StaffController>{
  public:
    void asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) ;
    PATH_LIST_BEGIN
    PATH_ADD(STAFF_LOGIN, HttpMethod::Post);
    PATH_ADD(GET_ORDERS, HttpMethod::Post);
    PATH_ADD(DELETE_OR_COMPLETE_ORDER, HttpMethod::Post);
    PATH_LIST_END
};
