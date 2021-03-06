/**
 * Created by ljs on 2017/4/12.
 */


import {AppEventName} from '../../ipc/EventNameConfig';

function getMusic(state = {}, action) {

    if (action.type == AppEventName.listMusic) {
        return {
            loading: false,
            list: action.list
        }
    } else if (action.type == AppEventName.sortMusic) {

        let {id, sort} = action;

        let {list} = state;


        let obj = list.find(n => {
            return n.id == id;
        })
        obj.sort = sort;

        list.sort((a, b) => {
            return a.sort - b.sort > 0 ? 1 : -1;
        })

        return {
            loading: false,
            list
        }
    } else if (action.type == AppEventName.delMusic) {
        let {id} = action;

        let {list} = state;

        list = list.filter(n => n.id != id);

        return {
            loading: false,
            list
        }

    } else if (action.type == AppEventName.renameMusic) {
        let {id, name} = action;
        let {list} = state;
        let obj = list.find(n => {
            return n.id == id;
        })
        obj.name = name;

        return {
            loading: false,
            list
        }
    } else if (action.type == AppEventName.addMusic) {
        let {newModel} = action;
        let {list} = state;

        list.push(newModel);
        return {
            loading: false,
            list,
        }

    } else if (action.type == AppEventName.delTrack) {
        let {id, count} = action;
        let {list} = state;
        let o = list.find(n => n.id == id);
        o.count += count;
        return {
            loading: false,
            list,
        }
    } else if (action.type == AppEventName.moveTrack) {
        let {newMId, oldMid} = action;
        let {list} = state;
        let newModel = list.find(n => n.id == newMId);
        newModel.count += 1;
        let oldModel = list.find(n => n.id == oldMid);
        oldModel.count -= 1;

        return {
            loading: false,
            list,
        }
    }else if(action.type==AppEventName.importMusic){
        let {id, count} = action;
        let {list} = state;
        let o = list.find(n => n.id == id);
        o.count+=count;
        return {
            loading: false,
            list,
        }
    }


    return state;

}

function getSelectMusic(state = -1, action) {
    if (action.type == AppEventName.selectMusic) {
        return action.select;
    }

    return state;

}


module.exports = {
    getMusic, getSelectMusic
}