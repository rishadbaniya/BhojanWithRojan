#pragma once

#include <drogon/HttpSimpleController.h>

using namespace drogon;

class UserController : public drogon::HttpSimpleController<UserController>
{
  public:
    void asyncHandleHttpRequest(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback);

    PATH_LIST_BEGIN

    // list path definitions here;
    PATH_ADD("/user_login", HttpMethod::Post); 
    PATH_ADD("/get_food_categories", HttpMethod::Post);
    PATH_ADD("/get_user_foods", HttpMethod::Post);
    PATH_ADD("/transfer_balance", HttpMethod::Post);


    // The "/change_password" accepts JSON data in such form, where id is the VALID ID whose password
    // is to be changed and new_password is the new password
    //
    //{
    //  "id" : 1,
    //  "new_password" : "XYZ" 
    //  "old_password" : "XYZ"
    //}
    PATH_ADD("/change_password", HttpMethod::Post);

    PATH_ADD("/pay_food", HttpMethod::Post);
    PATH_ADD("/get_daily_usage", HttpMethod::Post);

    PATH_LIST_END
};
