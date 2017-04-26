/**
 * Created by ljs on 2017/4/20.
 */
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const OpenFileDialog = "OpenFileDialog";
const fs = require('fs');
const path = require('path');
function bindFileDialog() {


    ipc.on(OpenFileDialog, function (event, {mid}) {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory', 'multiSelections']
        }, function (files) {

            event.returnValue = parseFiles(files);
        })
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

    //
    // let params = {open: true, max: list.length, value: 0};
    // event.sender.send(DataEvent.importDialog, params);
    //
    // for (let i in list) {
    //     let n = list[i];
    //     const tags = taglib.readTagsSync(n);
    //     console.log("==>", tags)
    //     params.value = i + 1;
    //     params.name = n;
    //     event.sender.send(DataEvent.importDialog, params);
    //
    //     const m = {
    //         name: path.basename(n, ".mp3"),
    //         path: n,
    //         length: tags.length,
    //         size: filesize(fs.statSync(n).size),
    //         mid,
    //
    //     }
    //     await _dbOperate.addTrackFromFile(m);
    //     console.log("==>", n)
    // }

    // list.forEach((n, i) => {
    //     const tags = taglib.readTagsSync(n);
    //     console.log("==>", tags)
    //     params.value = i + 1;
    //     params.name = n;
    //     event.sender.send(DataEvent.importDialog, params);
    //
    //     const m = {
    //         name: path.basename(n, ".mp3"),
    //         path: n,
    //         length: tags.length,
    //         size: filesize(fs.statSync(n).size),
    //         mid,
    //
    //     }
    //     _dbOperate.addTrackFromFile(m);
    //     console.log("==>", m)
    // })

    // params.open = false;
    // event.sender.send(DataEvent.importDialog, params);
    // event.returnValue = true;
}


module.exports = {
    bindFileDialog,
    OpenFileDialog,
}