const {ipcMain} = require('electron')
const Store = require('electron-store');
const appConfig = new Store();
const {AppEventName} = require('./EventNameConfig')

function BindAppConfigEvent(eventList) {

    eventList.forEach((n) => {
        ipcMain.on(n.eventName, (e, param) => {
            n.event(e, param);
        })
    })

}

const eventList = [
    {
        eventName: AppEventName.saveConfig,
        event: (e, {key, value}) => {
            appConfig.set(key, value);
        },
    },
    {
        eventName: AppEventName.getConfig,
        event: (e, {key, defValue}) => {
            e.returnValue = appConfig.get(key, defValue)
        },
    }
]


BindAppConfigEvent(eventList);