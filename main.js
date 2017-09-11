/**
 * Created by ljs on 15/10/30.
 */
const electron = require('electron');
const {app, BrowserWindow, globalShortcut, ipcMain} = electron;

var path = require('path');
var url = require('url');
var fs = require('fs');

const WindowMove = require('./app/ipc/WindowMoveIPC').moveApp;
const bindFileDialog = require('./app/ipc/FileDialogIPC').bindFileDialog;
const {DataBaseInit} = require('./app/ipc/DataBaseIPC');
require('./app/ipc/AppConfigIPC');

var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function () {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('will-quit', function () {
    globalShortcut.unregisterAll()
})

const debug = /--debug/.test(process.argv[2])


// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function () {


    var opt = {
        width: 1000,
        height: 600,
        frame: true,
        resizable: true,
        // 'web-preferences': {
        //     'plugins': true
        // },
        titleBarStyle: 'hidden',
        // webPreferences: {
        //     webaudio: true,
        // },
    }


    // var targetPath = "dist/index.html";
    // var targetUrl = url.format({
    //     protocol: 'file',
    //     pathname: targetPath,
    //     slashes: true,
    //     query: {
    //     }
    // });

    // var targetUrl = "http://localhost:7777/app/index.html";


    // var targetUrl="http://www.baidu.com";


    // 创建浏览器窗口。
    mainWindow = new BrowserWindow(opt);

    WindowMove(mainWindow);
    bindFileDialog();

    DataBaseInit(() => {
        // mainWindow.loadURL(targetUrl);
        mainWindow.loadURL(path.join('file://', __dirname, '/dist/index.html'))

    }, debug);


    if (debug) {
        mainWindow.openDevTools();
    }


    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function () {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });


    // globalShortcut.register('Command+A', function () {
    //
    //     // app.sender.send('test',{name:'ljs'});
    //     mainWindow.webContents.send("test",{name:'ljs'});
    //     console.log("==>a")
    // })

});
