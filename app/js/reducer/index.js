/**
 * Created by ljs on 2017/4/19.
 */

import {combineReducers} from 'redux';


const {getMusic, getSelectMusic}=require('./r_music');
const {getTrack, importTrack}=require('./r_track');
module.exports = combineReducers({
    musicList: getMusic,
    selectMusicId: getSelectMusic,
    trackList: getTrack,
    trackDialog: importTrack
})
