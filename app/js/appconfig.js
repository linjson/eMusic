import {ipcRenderer as ipc} from "electron";
import {AppEventName} from '../ipc/EventNameConfig';
import {keymirror} from '../ipc/Utils';


const Conf = keymirror({
    volume: null,
    silent: null,
    playModel: null,
    trackSelect:null,
    durationLength:null,
})


const PlayModel = keymirror({
    icon_loop: null,
    icon_repeat: null,
    icon_all_loop: null,
    icon_random: null,
    icon_list: null,
});


function saveConfig(key, value) {
    ipc.send(AppEventName.saveConfig, {key, value})
}

function readConfig(key, defValue = null) {
    return ipc.sendSync(AppEventName.getConfig, {key, defValue});
}


function* playModel() {
    while (true) {
        // yield PlayModel.icon_list;
        yield PlayModel.icon_repeat;
        // yield PlayModel.icon_all_loop;
        yield PlayModel.icon_random;
        yield PlayModel.icon_loop;
    }
}
const playModelAction = playModel();

module.exports = {
    saveConfig,
    readConfig,
    Conf,
    PlayModel,
    playModelAction
}