/**
 * Created by ljs on 2017/4/12.
 */


import {DataEvent} from '../../ipc/DataBaseIPCConfig';

function getTrack(state = {}, action) {

    if (action.type == DataEvent.listTrack) {
        return {
            loading: false,
            list: action.list
        }
    }


    return state;

}

function importTrack(state = {}, action) {
    if (action.type == DataEvent.importDialog) {
        let d = action.dialog;
        return {
            name: d.name,
            max: d.max,
            value: d.value,
            open: d.open,
        }
    }

    return state;
}


module.exports = {
    getTrack,
    importTrack,
}