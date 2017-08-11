const Store = require('electron-store');
const {bindIPCEvent} = require('./Utils');
const {AppEventName} = require('./EventNameConfig')
const appConfig = new Store();

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


bindIPCEvent(eventList);