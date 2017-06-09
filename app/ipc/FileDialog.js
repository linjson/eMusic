/**
 * Created by ljs on 2017/4/20.
 */
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const OpenFileDialog = "OpenFileDialog";
const DeleteFile = "DeleteFile";
const fs = require('fs');
const path = require('path');
function bindFileDialog() {


    ipc.on(OpenFileDialog, function (event, {mid}) {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory', 'multiSelections']
        }, function (files) {
            if (!files) {
                event.returnValue = [];
                return;
            }
            event.returnValue = parseFiles(files);
        })
    })

    ipc.on(DeleteFile, function (event, {path}) {

        fs.exists(path, (v) => {
            if (v) {
                fs.unlink(path);
            }
        });

        event.returnValue = null;
    })

}

function isMP3(file) {
    return path.extname(file) == '.mp3';
}

function findFileList(filepath, list) {

    var files = fs.readdirSync(filepath);

    files.forEach((n) => {
        let p = path.join(filepath, n);
        if (fs.statSync(p).isDirectory()) {
            findFileList(p, list)
        } else if (isMP3(p)) {
            list.push(p);
        }
    })
}

function parseFiles(files) {
    let list = [];

    files.forEach(n => {
        if (fs.statSync(n).isDirectory()) {
            findFileList(n, list);
        } else if (isMP3(n)) {
            list.push(n)
        }
    })
    return list;

}


module.exports = {
    bindFileDialog,
    OpenFileDialog,
    DeleteFile,
}