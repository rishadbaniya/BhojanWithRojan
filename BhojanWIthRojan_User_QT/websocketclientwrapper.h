#ifndef WEBSOCKETCLIENTWRAPPER_H
#define WEBSOCKETCLIENTWRAPPER_H

#include "websockettransport.h"
#include <QObject>
#include <QWebSocketServer>

class WebSocketTransport;

QT_BEGIN_NAMESPACE
class QWebSocketServer;
QT_END_NAMESPACE

class WebSocketClientWrapper : public QObject{
    Q_OBJECT

public:
    WebSocketClientWrapper(QWebSocketServer *server, QObject *parent = nullptr) : QObject(parent), m_server(server){
        connect(server, &QWebSocketServer::newConnection, this, &WebSocketClientWrapper::handleNewConnection);
    }

signals:
    void clientConnected(WebSocketTransport *client);

private slots:
    void handleNewConnection(){
        emit clientConnected(new WebSocketTransport(m_server->nextPendingConnection()));
    }

private:
    QWebSocketServer *m_server;
};

#endif // WEBSOCKETCLIENTWRAPPER_H
