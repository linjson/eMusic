/**
 * Created by ljs on 2017/4/12.
 */

import {combineReducers} from 'redux';
import {DataEvent} from '../../ipc/DataBaseIPCConfig';

function getMusic(state = {}, action) {

    if (action.type == DataEvent.listMusic) {
        return {
            loading: false,
            list:action.list
        }
    }


    return state;

}


module.exports = combineReducers({
    musicList: getMusic,
})
;