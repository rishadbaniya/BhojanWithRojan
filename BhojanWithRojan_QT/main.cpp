#include "mainwindow.h"
#include "core.h"
#include "websocketclientwrapper.h"
#include "websockettransport.h"
#include <QApplication>
#include <QWebEngineView>
#include <QtWebChannel/QWebChannel>
#include <QWebSocketServer>
#include <QObject>
#include <QApplication>
#include <websockettransport.h>


// TODO
// 1. Make sure the webview screen is on a certain zoom factor permanently i.e around 80% of the chrome
// 2. Disable pinch zoom in webview, which changes the zoom factor

#define ZOOM_FACTOR 0.8
#define WEBSOCKET_PORT 12345

int main(int argc, char *argv[]){
    QApplication a(argc, argv);
    QWebEngineView web_view;
    MainWindow w;
    web_view.load(QUrl("http://localhost:3000"));
    web_view.setZoomFactor(ZOOM_FACTOR);
    w.setCentralWidget(&web_view);

    QWebSocketServer server(QStringLiteral("Bhojan"), QWebSocketServer::NonSecureMode);
    if(!server.listen(QHostAddress::LocalHost, WEBSOCKET_PORT)){
        return 1;
    }else{
        qDebug("I got the server running");
    }

     WebSocketClientWrapper clientWrapper(&server); // Wraps WebSocket clients in QWebChannelAbstractTransport objects
     QWebChannel channel;
     QObject::connect(&clientWrapper, &WebSocketClientWrapper::clientConnected, &channel, &QWebChannel::connectTo);

    Core core;
    channel.registerObject(QStringLiteral("qt_object"),&core);
    w.showFullScreen()	;
    return a.exec();
}
