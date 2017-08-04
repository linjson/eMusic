/**
 * Created by ljs on 2017/4/12.
 */

import {AppEventName} from '../../ipc/EventNameConfig';
import {saveConfig} from "../appconfig";


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