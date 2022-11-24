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
    PATH_ADD("/get_admins", HttpMethod::Post);
    PATH_ADD("/delete_admin", HttpMethod::Post);

    PATH_ADD("/edit_admin", HttpMethod::Post);

    PATH_ADD("/add_user", HttpMethod::Post);
    PATH_ADD("/get_users", HttpMethod::Post);
    PATH_ADD("/edit_user", HttpMethod::Post);
    PATH_ADD("/delete_user", HttpMethod::Post);

    PATH_ADD("/add_staff", HttpMethod::Post);
    PATH_ADD("/edit_staff", HttpMethod::Post);


    PATH_ADD("/get_food_category", HttpMethod::Post);
    PATH_ADD("/add_food_category", HttpMethod::Post);
    PATH_ADD("/delete_food_category", HttpMethod::Post);

    PATH_ADD("/add_food", HttpMethod::Post);
    PATH_ADD("/delete_food", HttpMethod::Post);
    PATH_ADD("/get_foods", HttpMethod::Post);

    PATH_LIST_END
};
