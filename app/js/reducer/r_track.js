/**
 * Created by ljs on 2017/4/12.
 */


import {AppEventName} from '../../ipc/EventNameConfig';

function getTrack(state = {}, action) {

    if (action.type == AppEventName.listTrack) {
        return {
            loading: false,
            list: action.list,
            sort:action.sort,
        }
    }


    return state;

}

function importTrack(state = {}, action) {
    if (action.type == AppEventName.importDialog) {
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
    if (action.type == AppEventName.selectTrack) {
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