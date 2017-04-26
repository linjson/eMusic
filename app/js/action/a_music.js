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

    _listTrack(dispatch, mid){
        let list = ipc.sendSync(DataEvent.listTrack, {});
        dispatch({
            type: DataEvent.listTrack,
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
    },

    selectMusic(mid){

        return (dispatch, state) => {
            let list = ipc.sendSync(DataEvent.listTrack, {mid});
            dispatch({
                type: DataEvent.listTrack,
                list
            });
            dispatch({
                type: DataEvent.selectMusic,
                select: mid,
            });
        }
    },

    showTrackDialog({name, max, value, open}){
        return (d, s) => {
            d({
                type: DataEvent.importDialog,
                dialog: {name, max, value, open}
            })
        }
    },

    importTrack(files, i, mid){
        return (d, s) => {
            // const max = files.length;
            // d({
            //     type: DataEvent.importDialog,
            //     dialog: {open: true}
            // })
            // files.forEach((n, i) => {
            //     d({
            //         type: DataEvent.importDialog,
            //         dialog: {name: n, max, value: (i + 1), open: true}
            //     })
            ipc.send(DataEvent.addTrack, {files, i, mid});
            // })
            // d({
            //     type: DataEvent.importDialog,
            //     dialog: {open: false}
            // })
        }
    }
}


module.exports = action;