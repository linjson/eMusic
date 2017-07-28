/**
 * Created by ljs on 2017/4/12.
 */

import {AppEventName} from '../../ipc/EventNameConfig';

const ipc = require('electron').ipcRenderer

const {saveConfig, Conf} = require('../appconfig');

const action = {
    saveConfig(key, value){
        return (dispatch, state) => {
            saveConfig(key, value);
            dispatch({
                type: AppEventName.saveConfig,
                key,
                value,
            })
        }
    },

}


module.exports = action;