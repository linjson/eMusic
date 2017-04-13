/**
 * Created by ljs on 2017/4/12.
 */

import {DataEvent} from '../../ipc/DataBaseIPCConfig';


const ipc = require('electron').ipcRenderer


const action = {

    _listMusic(dispatch){
        let list = ipc.sendSync(DataEvent.listMusic, {});
        dispatch({
            type: DataEvent.listMusic,
            list
        })
    },

    addMusic(){
        return (dispatch, state) => {
            ipc.sendSync(DataEvent.addMusic, {name: "新建列表"});
            this._listMusic(dispatch);
        }
    },

    delMusic(id){
        return (dispatch, state) => {
            ipc.sendSync(DataEvent.delMusic, {id});
            this._listMusic(dispatch);
        }
    },

    renameMusic(id, name){
        return (dispatch, state) => {
            ipc.sendSync(DataEvent.renameMusic, {id, name});
            this._listMusic(dispatch);
        }
    },

    sortMusic(id, value, orderby){
        return (dispatch, state) => {
            const r = ipc.sendSync(DataEvent.sortMusic, {id, value, orderby});
            if (r) {
                this._listMusic(dispatch);
            }
        }
    }


}

module.exports = action;