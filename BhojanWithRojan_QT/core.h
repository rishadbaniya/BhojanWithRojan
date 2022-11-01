#ifndef CORE_H
#define CORE_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>

class Core : public QObject
{
    Q_OBJECT
public:
    explicit Core(QObject *parent = nullptr) : QObject{parent}{}

signals:
    void sendText(const QString &text);
public slots:

    // Gets the raw JSON from the webview and forwards it to the backend without even manipulating it
    void sendLoginCredentials(const QString& data){
        // Makes a request to the backend in order to get the to
        QNetworkAccessManager *qnam = new QNetworkAccessManager;
        QNetworkRequest request(QUrl("http://localhost:8000/admin_login"));
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        QNetworkReply *reply = qnam->post(request, data.toUtf8());

        QObject::connect(reply, &QNetworkReply::finished, [=](){
            if(reply->error() == QNetworkReply::NoError){
                QString body = QString::fromUtf8(reply->readAll());
                this->sendText(body);
            }
            else{
                QString err = reply->errorString();
                qDebug() << err;
            }
            reply->deleteLater();
        });
    }

    void addAdmin(const QString& data){

    }
};

#endif // CORE_H
