/**
 * Created by ljs on 2017/4/12.
 */

import {AppEventName} from '../../ipc/EventNameConfig';
import {DeleteFile} from '../../ipc/FileDialogIPC';

const ipc = require('electron').ipcRenderer


const action = {

    _listMusic(dispatch){
        let list = ipc.sendSync(AppEventName.listMusic, {});
        dispatch({
            type: AppEventName.listMusic,
            list
        })
    },

    _listTrack(dispatch){
        let list = ipc.sendSync(AppEventName.listTrack, {});
        dispatch({
            type: AppEventName.listTrack,
            list,
        })
    },

    addMusic(){
        return (dispatch, state) => {
            ipc.sendSync(AppEventName.addMusic, {name: "新建列表"});
            this._listMusic(dispatch);
        }
    },

    delMusic(id){
        return (dispatch, state) => {
            ipc.sendSync(AppEventName.delMusic, {id});
            this._listMusic(dispatch);
        }
    },

    renameMusic(id, name){
        return (dispatch, state) => {
            ipc.sendSync(AppEventName.renameMusic, {id, name});
            this._listMusic(dispatch);
        }
    },

    sortMusic(id, value, orderby){
        return (dispatch, state) => {
            const r = ipc.sendSync(AppEventName.sortMusic, {id, value, orderby});
            if (r) {
                this._listMusic(dispatch);
            }
        }
    },

    selectMusic(mid){

        return (dispatch, state) => {
            let list = ipc.sendSync(AppEventName.listTrack, {mid});
            dispatch({
                type: AppEventName.listTrack,
                list,
            });
            dispatch({
                type: AppEventName.selectMusic,
                select: mid,
            });
        }
    },

    showTrackDialog({name, max, value, open}){
        return (d, s) => {
            d({
                type: AppEventName.importDialog,
                dialog: {name, max, value, open}
            })
        }
    },

    importTrack(files, mid){
        return (d, s) => {
            // const max = files.length;
            // d({
            //     type: AppEventName.importDialog,
            //     dialog: {open: true}
            // })
            // files.forEach((n, i) => {
            //     d({
            //         type: AppEventName.importDialog,
            //         dialog: {name: n, max, value: (i + 1), open: true}
            //     })
            ipc.send(AppEventName.addTrack, {files, mid});
            // })
            // d({
            //     type: AppEventName.importDialog,
            //     dialog: {open: false}
            // })
        }
    },
    listMusic(){
        return (d, s) => {
            let list = ipc.sendSync(AppEventName.listMusic, {});
            d({
                type: AppEventName.listMusic,
                list
            })
        }
    },
    selectTrack(tracklist, currentIndex, trackId){
        return (d, s) => {
            let track = tracklist[currentIndex];
            track.times++;
            ipc.send(AppEventName.increaseTrack, {id: track.id, times: track.times});
            d({
                type: AppEventName.selectTrack,
                tracklist,
                currentIndex,
                trackId
            })
        }
    },
    delTrack(data, removeFile){
        return (d, s) => {
            let {mid} = data;
            ipc.sendSync(AppEventName.delTrack, {id: data.id});
            if (removeFile) {
                ipc.send(DeleteFile, {path: data.path});
            }
            let list = ipc.sendSync(AppEventName.listTrack, {mid});
            this._listMusic(d);
            d({
                type: AppEventName.listTrack,
                list,
            })
        }
    },

    moveTrack(data, mid){
        return (d, s) => {
            ipc.sendSync(AppEventName.moveTrack, {id: data.id, mid});
            let list = ipc.sendSync(AppEventName.listTrack, {mid: data.mid});
            this._listMusic(d);
            d({
                type: AppEventName.listTrack,
                list,
            })
        }
    },
    searchTrack(name, mid){
        return (d, s) => {
            let list = ipc.sendSync(AppEventName.searchTrack, {name, mid});
            d({
                type: AppEventName.listTrack,
                list,
            })
            // console.log("==>", v)
            // _listMusic(d);

        }
    },
    sortTrack(list, sort){
        return (d, s) => {

            d({
                type: AppEventName.listTrack,
                list,
            })
        }
    }
}


module.exports = action;