#ifndef CORE_H
#define CORE_H

#include <QObject>
#include <QDebug>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QApplication>

// API'S
#define STAFF_LOGIN "/admin_login" // Used to authenticate the user
#define GET_ORDERS "/get_orders" // Used to get food categories
#define COMPLETE_ORDERS "/delete_or_complete_order" // Used to get food for certain category

#define SERVER_CANNOT_BE_REACED "SERVER_CANNOT_BE_REACHED"

class Core : public QObject
{
    Q_OBJECT

public:
    QString backendAddress;
    QApplication* q_app;

    QString staffLoginAdr;
    QString getOrdersAdr;
    QString deleteOrCompleteOrderAdr;

    explicit Core(QObject *parent = nullptr, QString __backendAddress = "", QApplication* q__app = nullptr) : QObject{parent}{

        q_app = q__app;
        backendAddress = __backendAddress;

        staffLoginAdr = backendAddress;
        getOrdersAdr = backendAddress;
        deleteOrCompleteOrderAdr = backendAddress;

        staffLoginAdr.append(STAFF_LOGIN);
        getOrdersAdr.append(GET_ORDERS);
        deleteOrCompleteOrderAdr.append(COMPLETE_ORDERS);
    }

signals:

    void staffLoginResponse(const QString &test);
    void getOrdersResponse(const QString &text);

public slots:

    void exit(){
        q_app->exit();
    }

    void staffLogin(const QString &data){
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(staffLoginAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit staffLoginResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit staffLoginResponse(body);
            }
            reply->deleteLater();
        });
    }

    void getOrders(const QString &data){

        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(getOrdersAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                emit getOrdersResponse(body);
            }
            else{
                QString body = QString(SERVER_CANNOT_BE_REACED);
                emit getOrdersResponse(body);
            }
            reply->deleteLater();
        });
    }

    void deleteOrCompleteOrder(const QString &data){
        qDebug() << data;
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(deleteOrCompleteOrderAdr);
        request.setHeader(QNetworkRequest::ContentTypeHeader, "text/plain");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());
        QObject::connect(reply, &QNetworkReply::finished, [=](){
            reply->deleteLater();
        });
    }
};


#endif // CORE_H
