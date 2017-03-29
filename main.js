/**
 * Created by ljs on 15/10/30.
 */
const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
//var dialog = require('dialog');
var path = require('path');
var url = require('url');
var fs = require('fs');

const WindowMove = require('./app/ipc/WindowMoveIPC').moveApp;

// var electronCompile=require('electron-compile');
// 给我们的服务器发送异常报告。
//require('crash-reporter').start();

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function () {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// var cachePath = path.join(__dirname, 'cache');
// var devMode = (process.argv || []).indexOf('-r') !== -1;


// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function () {

    // if (fs.statSyncNoException(cachePath) && !devMode) {
    //     electronCompile.initForProduction(cachePath);
    //     console.log("initForProduction");
    // } else {
    //     var appRoot = path.join(__dirname, '..');
    //     electronCompile.init(appRoot,'.');
    //     console.log("init");
    // }


    //var _ = require("underscore-plus");
    var opt = {
        width: 800,
        height: 600,
        frame: true,
        resizable: true,
        'web-preferences': {
            'plugins': true
        },
        titleBarStyle: 'hidden',
    }


    // var targetPath = path.resolve(__dirname, 'dist', 'index.html');
    // var targetUrl = url.format({
    //     protocol: 'file',
    //     pathname: targetPath,
    //     slashes: true,
    //     query: {
    //     }
    // });

    var targetUrl = "http://localhost:7777/app/index.html";


    // 创建浏览器窗口。
    mainWindow = new BrowserWindow(opt);

    WindowMove(mainWindow);

    // 加载应用的 index.html
    //mainWindow.loadURL("http://www.schillmania.com/projects/soundmanager2/doc/getstarted/#troubleshooting-flash9-highperformance");
    mainWindow.loadURL(targetUrl);

    // 打开开发工具
    mainWindow.openDevTools();

    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function () {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });


});

