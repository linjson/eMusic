/**
 * Created by ljs on 2017/4/12.
 */

import _ from 'lodash';
import {AppEventName} from '../../ipc/EventNameConfig';
const {saveConfig, Conf} = require('../appconfig');
function getTrack(state = {}, action) {

    if (action.type == AppEventName.listTrack) {
        return {
            loading: false,
            list: action.list,
        }
    } else if (action.type == AppEventName.sortTrack) {
        let {sortBy, sortDirection} = action;
        let {list} = state;

        list = _.orderBy(list, [sortBy], [sortDirection]);

        return {
            loading: false,
            list,
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
        let r = {
            tracklist: action.tracklist,
            currentIndex: action.currentIndex,
            trackId: action.trackId,

        };
        saveConfig(Conf.trackSelect, r);


        return r;
    }

    return state;
}


module.exports = {
    getTrack,
    importTrack,
    selectTrack,
}