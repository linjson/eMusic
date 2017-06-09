/**
 * Created by ljs on 2017/4/12.
 */

import {DataEvent} from '../../ipc/DataBaseIPCConfig';
import {DeleteFile} from '../../ipc/FileDialog';

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
            list,
            mid,
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
                list,
                mid
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
    },
    listMusic(){
        return (d, s) => {
            let list = ipc.sendSync(DataEvent.listMusic, {});
            d({
                type: DataEvent.listMusic,
                list
            })
        }
    },
    selectTrack(tracklist, currentIndex, mid){
        return (d, s) => {
            d({
                type: DataEvent.selectTrack,
                tracklist,
                currentIndex,
                mid
            })
        }
    },
    delTrack(data, removeFile){
        return (d, s) => {
            let {mid} = data;
            ipc.sendSync(DataEvent.delTrack, {id: data.id});
            if (removeFile) {
                ipc.send(DeleteFile, {path: data.path});
            }
            let list = ipc.sendSync(DataEvent.listTrack, {mid});
            this._listMusic(d);
            d({
                type: DataEvent.listTrack,
                list,
                mid,
            })
        }
    },

    moveTrack(data,mid){
        return (d, s) => {
            ipc.sendSync(DataEvent.moveTrack, {id: data.id,mid});
            let list = ipc.sendSync(DataEvent.listTrack, {mid:data.mid});
            this._listMusic(d);
            d({
                type: DataEvent.listTrack,
                list,
                mid:data.mid,
            })
        }
    }
}


module.exports = action;