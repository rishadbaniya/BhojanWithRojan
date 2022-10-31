#pragma once
#include <drogon/HttpSimpleController.h>

using namespace drogon;

class AdminController : public drogon::HttpSimpleController<AdminController>{
  public:
    void asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback) ;
    PATH_LIST_BEGIN
    // list path definitions here;
    PATH_ADD("/admin_login", HttpMethod::Post);
    PATH_ADD("/add_admin", HttpMethod::Post);
    PATH_ADD("/edit_admin", HttpMethod::Post);
    PATH_ADD("/add_user", HttpMethod::Post);
    PATH_ADD("/edit_user", HttpMethod::Post);
    PATH_ADD("/add_staff", HttpMethod::Post);
    PATH_ADD("/edit_staff", HttpMethod::Post);
    PATH_ADD("/add_edit_food", HttpMethod::Post);
    PATH_LIST_END
    
};
