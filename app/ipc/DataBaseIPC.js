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


const DataBaseEventFuncList = [
    {
        eventName: DataEvent.addMusic,
        event: async(e, {name, sort}) => {
            if (!sort) {
                sort = await Musics.count();
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
        eventName: DataEvent.sortMusic,
        event: async(e, {id, sort}) => {
            const v = await Musics.update({sort}, {where: {id}});
            e.returnValue = v.toJSON();
        }
    },
    {
        eventName: DataEvent.listMusic,
        event: async(e, {}) => {
            const v = await Musics.findAll();
            const list = _.forEach(v, (n) => n.toJSON())
            e.returnValue = list;
        }
    },
    {
        eventName: DataEvent.delMusic,
        event: async(e, {id}) => {
            const v = await Musics.destroy({where: {id}});
            e.returnValue = v;
        }
    }

]

BindDataBaseEvent(DataBaseEventFuncList);

module.exports = {DataBaseInit, Musics};