const electron = require('electron');
const ipcMain = electron.ipcMain

const keymirror = function keyMirror(obj) {
    var ret = {};
    var key;
    if (obj instanceof Object && !Array.isArray(obj)) {
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
    }
    return ret;
};

const sumBy = (list, fn) => {
    let sum = 0;
    list.forEach(n => {
        let v = fn(n) || 0;
        sum += v;
    });
    return sum;
}

const bindIPCEvent = (eventlist) => {
    eventlist.forEach((n) => {
        ipcMain.on(n.eventName, (e, param) => {
            n.event(e, param);
        })
    })
}

module.exports = {
    keymirror, sumBy, bindIPCEvent
};