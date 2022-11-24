#include "mainwindow.h"
#include "websocketclientwrapper.h"
#include "websockettransport.h"
#include <QApplication>
#include <QWebEngineView>
#include <QtWebChannel/QWebChannel>
#include <QWebSocketServer>
#include <QObject>
#include <QFile>
#include <QApplication>
#include <websockettransport.h>
#include "core.h"
#include <QWebEngineSettings>

using namespace std;

// TODO
// 1. Make sure the webview screen is on a certain zoom factor permanently i.e around 80% of the chrome
// 2. Disable pinch zoom in webview, which changes the zoom factor

#define ZOOM_FACTOR 0.8
#define WEBSOCKET_PORT 12350

int main(int argc, char *argv[]){

    QApplication a(argc, argv);
    QString addressFile = a.applicationDirPath();
    addressFile.append("/address.txt");

    QFile file(addressFile);
    QString backendAddress("");
    if(file.exists()){
        if (file.open(QIODevice::ReadOnly)){
            QTextStream in(&file);
            backendAddress = in.readLine();
            file.close();
           }
    }else{
        a.exit();
    }

    QWebEngineView web_view;
    MainWindow w;

    web_view.settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessRemoteUrls, true);
    web_view.settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessFileUrls, true);

    QString UI_PATH = a.applicationDirPath() +  "/ui/index.html";
    web_view.load(QUrl::fromLocalFile(UI_PATH));

//    web_view.load(QUrl("http://172.18.170.53:3000"));
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

    Core core(nullptr, backendAddress);
    channel.registerObject(QStringLiteral("qt_object"),&core);
    w.showFullScreen();
    return a.exec();

}
