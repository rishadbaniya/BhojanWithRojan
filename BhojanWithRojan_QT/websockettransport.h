#pragma once
#ifndef WEBSOCKETTRANSPORT_H
#define WEBSOCKETTRANSPORT_H

#include <QWebChannelAbstractTransport>
#include <QObject>
#include <QWebSocket>
#include <QJsonDocument>
#include <QJsonObject>

QT_BEGIN_NAMESPACE
class QWebSocket;
QT_END_NAMESPACE

class WebSocketTransport : public QWebChannelAbstractTransport{
    Q_OBJECT
public:
    explicit WebSocketTransport(QWebSocket *socket) : QWebChannelAbstractTransport(socket), m_socket(socket){
        connect(socket, &QWebSocket::textMessageReceived, this, &WebSocketTransport::textMessageReceived);
        connect(socket, &QWebSocket::disconnected, this, &WebSocketTransport::deleteLater);
    }
    virtual ~WebSocketTransport(){
        m_socket->deleteLater();
    }

    void sendMessage(const QJsonObject &message) override{
        QJsonDocument doc(message);
        m_socket->sendTextMessage(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
    }

private slots:
    void textMessageReceived(const QString &messageData){
        QJsonParseError error;
        QJsonDocument message = QJsonDocument::fromJson(messageData.toUtf8(), &error);
        if (error.error) {
            qWarning() << "Failed to parse text message as JSON object:" << messageData
                       << "Error is:" << error.errorString();
            return;
        } else if (!message.isObject()) {
            qWarning() << "Received JSON message that is not an object: " << messageData;
            return;
        }
        emit messageReceived(message.object(), this);
    }

private:
    QWebSocket *m_socket;
};

#endif // WEBSOCKETTRANSPORT_H
