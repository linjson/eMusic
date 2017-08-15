/**
 * Created by ljs on 2017/4/12.
 */

import {AppEventName} from '../../ipc/EventNameConfig';
import {saveConfig as setConfig,Conf} from "../appconfig";


const action = {
    saveConfig(key, value){
        return (dispatch, state) => {
            setConfig(key, value);
            dispatch({
                type: AppEventName.saveConfig,
                key,
                value,
            })
        }
    },
    playControl(value){
        return {
            type:AppEventName.saveConfig,
            key:Conf.play,
            value,
        }
    }

}


module.exports = action;