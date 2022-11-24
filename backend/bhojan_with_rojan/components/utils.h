#pragma once

#ifndef _UTILS_H_
#define _UTILS_H_
// path of the database that stores all the stuff
#include <iostream>
#include <chrono>
#include <time.h>
#include <drogon/drogon.h>

using namespace std;

const string DB = "./test.db";

#define OK 0  // Successful operation

#define ERR_ADMIN_USERNAME_WAS_TAKEN 1  // Username of the admin was already taken
#define ERR_DATABASE_ERROR_OCCURED 2 // Database related error occured
#define ERR_FOOD_NAME_ALREADY_TAKEN 3 // Name of the food was already taken
#define ERR_USER_USERNAME_ALREADY_TAKEN 4 // Username of the user was already taken

// Name of all the tables used in the admin work
const string ADMIN_TABLE = "admin";
const string STAFF_TABLE = "staff";
const string USER_TABLE = "user";
const string FOOD_TABLE = "food";
const string QUEUE_TABLE = "queue";
const string FOOD_CATEGORIES_TABLE = "food_categories";
const string PDF_GENERATION_BACKEND = "http://192.168.2.105:8001";

typedef struct {
    string month;
    string year;
    string day;
} DOB;

typedef struct {
    string image_data; // Base64 encoded string data
    string file_name; // Name of the file with extension
} Image;

#endif
