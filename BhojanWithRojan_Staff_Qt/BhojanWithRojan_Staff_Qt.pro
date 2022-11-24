QT       += core gui
QT += webenginewidgets
QT += webchannel
QT += websockets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mainwindow.cpp \

HEADERS += \
    core.h \
    core.h \
    core.h \
    mainwindow.h \
    websocketclientwrapper.h \
    websocketclientwrapper.h \
    websocketclientwrapper.h \
    websockettransport.h \
    websockettransport.h \
    websockettransport.h

FORMS += \
    mainwindow.ui

INCLUDEPATH += "C:\Program Files (x86)\Windows Kits\10\Include\10.0.18362.0\ucrt"
LIBS += -L"C:\Program Files (x86)\Windows Kits\10\Lib\10.0.18362.0\um\x64"
LIBS += -L"C:\Program Files (x86)\Windows Kits\10\Lib\10.0.18362.0\ucrt\x64"

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target
