/**
 * Created by ljs on 2017/4/12.
 */


import {AppEventName} from '../../ipc/EventNameConfig';

function getMusic(state = {}, action) {

    if (action.type == AppEventName.listMusic) {
        return {
            loading: false,
            list: action.list
        }
    }


    return state;

}

function getSelectMusic(state = -1, action) {
    if (action.type == AppEventName.selectMusic) {
        return action.select;
    }

    return state;

}


module.exports = {
    getMusic, getSelectMusic
}