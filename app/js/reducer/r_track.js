/**
 * Created by ljs on 2017/4/12.
 */


import {DataEvent} from '../../ipc/DataBaseIPCConfig';

function getTrack(state = {}, action) {

    if (action.type == DataEvent.listTrack) {
        return {
            loading: false,
            list: action.list,
            sort:action.sort,
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

function selectTrack(state = {}, action) {
    if (action.type == DataEvent.selectTrack) {
        return {
            tracklist: action.tracklist,
            currentIndex:action.currentIndex,
            trackId:action.trackId,

        };
    }

    return state;
}


module.exports = {
    getTrack,
    importTrack,
    selectTrack,
}