/**
 * Created by ljs on 2017/4/19.
 */

import {combineReducers} from 'redux';
import {getMusic, getSelectMusic} from "./r_music";
import {getTrack, importTrack, selectTrack} from "./r_track";
import {getAppConfig} from "./r_appconfig";
import {routerReducer} from 'react-router-redux'

module.exports = combineReducers({
    musicList: getMusic,
    selectMusicId: getSelectMusic,
    trackList: getTrack,
    trackDialog: importTrack,
    trackSelect: selectTrack,
    appConfig: getAppConfig,
    // router: routerReducer,
})
