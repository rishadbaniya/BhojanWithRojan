#ifndef CORE_H
#define CORE_H

#include <QObject>
#include <QDebug>
#include <QNetworkAccessManager>
#include <QNetworkReply>

// API'S
#define USER_LOGIN "/user_login" // Used to authenticate the user
#define GET_FOOD_CATEGORIES "/get_food_categories" // Used to get food categories
#define GET_USER_FOODS "/get_user_foods" // Used to get food for certain category
#define TRANSFER_BALANCE "/transfer_balance" // Used to get food for certain category
#define CHANGE_PASSWORD  "/change_password" // Used to get food for certain category
#define PAY_FOOD "/pay_food" // Used to get food for certain category
#define GET_DAILY_USAGE "/get_daily_usage" // Used to get food for certain category

#define SERVER_CANNOT_BE_REACED "SERVER_CANNOT_BE_REACHED"

class Core : public QObject
{
    Q_OBJECT

public:
    QString backendAddress;

    QString userLoginAdr;
    QString getFoodCategoriesAdr;
    QString getUserFoodsAdr;
    QString transferBalanceAdr;
    QString changePasswordAdr;
    QString payFoodAdr;
    QString getDailyUsageAdr;

    explicit Core(QObject *parent = nullptr, QString __backendAddress = "") : QObject{parent}{
        backendAddress = __backendAddress;

        userLoginAdr = backendAddress;
        getFoodCategoriesAdr = backendAddress;
        getUserFoodsAdr = backendAddress;
        transferBalanceAdr = backendAddress;
        changePasswordAdr = backendAddress;
        payFoodAdr = backendAddress;
        getDailyUsageAdr = backendAddress;

        userLoginAdr.append(USER_LOGIN);
        getFoodCategoriesAdr.append(GET_FOOD_CATEGORIES);
        getUserFoodsAdr.append(GET_USER_FOODS);
        transferBalanceAdr.append(TRANSFER_BALANCE);
        changePasswordAdr.append(CHANGE_PASSWORD);
        payFoodAdr.append(PAY_FOOD);
        getDailyUsageAdr.append(GET_DAILY_USAGE);

    }

signals:

    void userLoginResponse(const QString &test);
    void getFoodCategoriesResponse(const QString &text);
    void getUserFoodsResponse(const QString &text);
    void transferBalanceResponse(const QString &text);
    void changePasswordResponse(const QString &text);
    void payFoodResponse(const QString &text);
    void getDailyUsageResponse(const QString &text);



public slots:
    void userLogin(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(userLoginAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit userLoginResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit userLoginResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getFoodCategories(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(getFoodCategoriesAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getFoodCategoriesResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit getFoodCategoriesResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getUserFoods(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(getUserFoodsAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getUserFoodsResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit getUserFoodsResponse(body);
            }
            reply->deleteLater();
        });
    }

    void transferBalance(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(transferBalanceAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit transferBalanceResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit transferBalanceResponse(body);
            }
            reply->deleteLater();
        });
    }

    void changePassword(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(changePasswordAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit changePasswordResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit changePasswordResponse(body);
            }
            reply->deleteLater();
        });
    }

    void payFood(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(payFoodAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit payFoodResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit payFoodResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getDailyUsage(const QString &data){

        qDebug() << "GOT HERE BRO";
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(getDailyUsageAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getDailyUsageResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit getDailyUsageResponse(body);
            }
            reply->deleteLater();
        });
    }
};


#endif // CORE_H
