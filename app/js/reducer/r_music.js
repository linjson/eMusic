/**
 * Created by ljs on 2017/4/12.
 */


import {DataEvent} from '../../ipc/DataBaseIPCConfig';

function getMusic(state = {}, action) {

    if (action.type == DataEvent.listMusic) {
        return {
            loading: false,
            list: action.list
        }
    }


    return state;

}

function getSelectMusic(state = -1, action) {
    if (action.type == DataEvent.selectMusic) {
        return action.select;
    }

    return state;

}


module.exports = {
    getMusic, getSelectMusic
}