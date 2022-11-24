#ifndef CORE_H
#define CORE_H

#include "qapplication.h"
#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>


#define SERVER_CANNOT_BE_REACED "SERVER_CANNOT_BE_REACHED"

class Core : public QObject
{
    Q_OBJECT
public:
    QApplication* q_app;
    explicit Core(QObject *parent = nullptr, QApplication* _q_app = nullptr) : QObject{parent}{
        q_app = _q_app;
    }

signals:

    void sendText(const QString &text);//✅
    void addAdminResponse(const QString &text);//✅
    void getAdminsResponse(const QString &text);//✅
    void getDeleteAdminResponse(const QString &text);//✅

    void addFoodResponse(const QString &text);//✅
    void getFoodsResponse(const QString &text);//✅
    void deleteFoodCategoryResponse(const QString &test);

    void getFoodCategoryResponse(const QString &test);
    void addFoodCategoryResponse(const QString &test);

    void addUserResponse(const QString &text);//✅
    void getUsersResponse(const QString &text); //✅
    void deleteUserResponse(const QString &text); //✅
    void editUserBalanceResponse(const QString &text);


    void deleteFoodResponse(const QString &text); // TO BE IMPLEMENTED


public slots:

    void exit(){
        q_app->exit();
    }

    // Gets the raw JSON from the webview and forwards it to the backend without even manipulating it
    void sendLoginCredentials(const QString& data){
        // Makes a request to the backend in order to get the to
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/admin_login"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit sendText(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit sendText(body);
            }
            reply->deleteLater();
        });
    }

    void addAdmin(const QString& data){
        // Makes a request to the backend in order to get the to
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/add_admin"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit addAdminResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit addAdminResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getAdmins(){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/get_admins"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, QString("").toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getAdminsResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit getAdminsResponse(body);
            }
            reply->deleteLater();
        });
    }

    void deleteAdmin(const QString& data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/delete_admin"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getDeleteAdminResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit getAdminsResponse(body);
            }
            reply->deleteLater();
        });
    }


    // CRUD operation on User by Admin
    void addUser(const QString& data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/add_user"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit addUserResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit addUserResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getUsers(){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/get_users"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, QString("").toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getUsersResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit getUsersResponse(body);
            }
            reply->deleteLater();
        });
    }

    void deleteUser(const QString& data){
        qDebug() << data;
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/delete_user"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit deleteUserResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit deleteUserResponse(body);
            }
            reply->deleteLater();
        });
    }

    void editUserBalance(const QString& data){
        qDebug() << data;
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/edit_user"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit editUserBalanceResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit editUserBalanceResponse(body);
            }
            reply->deleteLater();
        });
    }

    void addFood(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/add_food"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit addFoodResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit addFoodResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getFoods(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/get_foods"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getFoodsResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit getFoodsResponse(body);
            }
            reply->deleteLater();
        });
    }

    void deleteFoodCategory(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/delete_food_category"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit deleteFoodCategoryResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit deleteFoodCategoryResponse(body);
            }
            reply->deleteLater();
        });
    }

    void deleteFood(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/delete_food"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit deleteFoodResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit deleteFoodResponse(body);
            }
            reply->deleteLater();
        });
    }

    void addFoodCategory(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/add_food_category"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit addFoodCategoryResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit addFoodCategoryResponse(body);
            }
            reply->deleteLater();
        });
    }


    void getFoodCategory(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://10.42.0.1:8000/get_food_category"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getFoodCategoryResponse(body);
            }
            else{
                QString body = QString("SERVER_CANNOT_BE_REACHED");
                emit getFoodCategoryResponse(body);
            }
            reply->deleteLater();
        });
    }
};



#endif // CORE_H
