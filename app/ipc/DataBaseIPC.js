/**
 * Created by ljs on 2017/3/30.
 */
require('sqlite3');
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
            e.sender.send(DataEvent.addMusic, v.toJSON());
        }
    },
    {
        eventName: DataEvent.renameMusic,
        event: async(e, {id, name}) => {
            console.log("==>",name,id);
            const v=await Musics.update({name},{ where:{id}});
            e.sender.send(DataEvent.renameMusic, v.toString());
        }
    },
    {
        eventName: DataEvent.sortMusic,
        event: async(e, {id, sort}) => {
            console.log("==>",name,id);
            const v=await Musics.update({sort},{ where:{id}});
            e.sender.send(DataEvent.renameMusic, v.toString());
        }
    },

]

BindDataBaseEvent(DataBaseEventFuncList);

module.exports = {DataBaseInit, Musics};