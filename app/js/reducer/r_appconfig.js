/**
 * Created by ljs on 2017/4/12.
 */


import {AppEventName} from '../../ipc/EventNameConfig';

function getAppConfig(state = {}, action) {

    if (action.type == AppEventName.saveConfig) {
        const k = action.key;
        state[k]=action.value;
        return {
            ...state,
        };
    }else if(action.type==AppEventName.playControl){
        const k = action.key;
        state[k]=action.value;
        return {
            ...state,
        };
    }

    return state;

}


module.exports = {
    getAppConfig,
}