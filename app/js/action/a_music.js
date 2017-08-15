/**
 * Created by ljs on 2017/4/12.
 */

import {AppEventName} from '../../ipc/EventNameConfig';
import {DeleteFile} from '../../ipc/FileDialogIPC';
import {ipcRenderer as ipc} from "electron";


const action = {

    // _listMusic(dispatch){
    //     let list = ipc.sendSync(AppEventName.listMusic, {});
    //     dispatch({
    //         type: AppEventName.listMusic,
    //         list
    //     })
    // },
    //
    // _listTrack(dispatch){
    //     let list = ipc.sendSync(AppEventName.listTrack, {});
    //     dispatch({
    //         type: AppEventName.listTrack,
    //         list,
    //     })
    // },

    addMusic(){
        return (dispatch, state) => {
            let v = ipc.sendSync(AppEventName.addMusic, {name: "新建列表"});
            v.count = 0;
            dispatch({
                type: AppEventName.addMusic,
                newModel: v,
            })
        }
    },

    delMusic(id){
        return (dispatch, state) => {
            ipc.send(AppEventName.delMusic, {id});
            dispatch({
                type: AppEventName.delMusic,
                id
            })
        }
    },

    renameMusic(id, name){
        return (dispatch, state) => {
            ipc.send(AppEventName.renameMusic, {id, name});
            dispatch({
                type: AppEventName.renameMusic,
                id,
                name
            })
        }
    },

    sortMusic(id, sort){
        return (dispatch, state) => {
            ipc.send(AppEventName.sortMusic, {id, value: sort});
            dispatch({
                type: AppEventName.sortMusic,
                id,
                sort
            })
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
    delTrack(oldlist, data, removeFile){
        return (d, s) => {
            ipc.send(AppEventName.delTrack, {id: data.id});
            if (removeFile) {
                ipc.send(DeleteFile, {path: data.path});
            }
            let list = oldlist.filter(n => n.id != data.id);
            d({
                type: AppEventName.delTrack,
                id: data.mid,
                count: -1,
            });

            d({
                type: AppEventName.listTrack,
                list,
            });
        }
    },

    moveTrack(oldlist, data, mid){
        return (d, s) => {
            ipc.send(AppEventName.moveTrack, {id: data.id, mid});
            let list = oldlist.filter(n => n.id != data.id);
            d({
                type: AppEventName.moveTrack,
                newMId: mid,
                oldMid: data.mid,
            });
            d({
                type: AppEventName.listTrack,
                list,
            });
        }
    },
    searchTrack(name, mid){
        return (d, s) => {
            let list = ipc.sendSync(AppEventName.searchTrack, {name, mid});
            d({
                type: AppEventName.listTrack,
                list,
            })

        }
    },
    sortTrack(sortBy, sortDirection){
        return {
            type: AppEventName.sortTrack,
            sortBy, sortDirection,
        }
    },
    importMusic(id, count){
        return {
            type: AppEventName.importMusic,
            id,
            count
        }
    }
}


module.exports = action;