/**
 * Created by ljs on 2017/3/30.
 */
require('sqlite3');
const _ = require('lodash');
const ipcMain = require('electron').ipcMain
const {DataEvent}=require('./DataBaseIPCConfig')

const Sequelize = require('sequelize');

var dbFile = "emusic.sqlite3";

var sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: dbFile,
});


var Musics = sequelize.define('musics', {
    name: Sequelize.STRING,
    sort: Sequelize.FLOAT,
}, {
    timestamps: false // timestamps will now be true
});

var Tracks = sequelize.define('tracks', {
    name: Sequelize.STRING,
    path: Sequelize.STRING,
    length: Sequelize.INTEGER,
    times: Sequelize.INTEGER,
}, {
    timestamps: false // timestamps will now be true
});


function DataBaseInit(cb) {
    sequelize.sync().then(cb)
}

function BindDataBaseEvent(eventList) {
    eventList.forEach((n) => {
        ipcMain.on(n.eventName, (e, param) => {
            n.event(e, param);
        })
    })

}

function convertListJson(list) {
    return _.map(list, (n) => n.toJSON());
}


const DataBaseEventFuncList = [
    {
        eventName: DataEvent.addMusic,
        event: async(e, {name, sort}) => {
            if (!sort) {
                sort = await Musics.max('sort');
                sort += 1;
            }
            const v = await Musics.create({name, sort});
            e.returnValue = v.toJSON();
        }
    },
    {
        eventName: DataEvent.renameMusic,
        event: async(e, {id, name}) => {
            const v = await Musics.update({name}, {where: {id}});
            e.returnValue = v.toString();
        }
    },
    {
        eventName: DataEvent.listMusic,
        event: async(e, {}) => {
            const v = await Musics.findAll({order: [['sort']]});
            const list = convertListJson(v);
            e.returnValue = list;
        }
    },
    {
        eventName: DataEvent.delMusic,
        event: async(e, {id}) => {
            const v = await Musics.destroy({where: {id}});
            e.returnValue = v;
        }
    },
    {
        eventName: DataEvent.sortMusic,
        event: async(e, {id, value, orderby}) => {
            let sort = orderby == "up" ? {lt: value} : {gt: value};
            let order = orderby == "up" ? [["sort", "desc"]] : null;
            const v = await Musics.findAll({
                where: {
                    sort
                }, limit: 2, order
            });

            const list = convertListJson(v);
            if (list.length == 0) {
                e.returnValue = false;
                return;
            }
            let result = 0;
            if (list.length == 1) {
                result = list[0].sort + (orderby == "down" ? 1 : -1);
            } else {
                result = _.reduce(list, (total, n) => total + n.sort, 0) / 2;
            }
            await Musics.update({sort: result}, {where: {id}});
            e.returnValue = true;
        }
    },

]

BindDataBaseEvent(DataBaseEventFuncList);

module.exports = {DataBaseInit, Musics};