/**
 * Created by ljs on 2017/3/30.
 */
require('sqlite3');
const _ = require('lodash');
const ipcMain = require('electron').ipcMain
const {DataEvent} = require('./DataBaseIPCConfig')

const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const filesize = require("filesize");

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
    size: Sequelize.STRING,
    times: Sequelize.INTEGER,
    mid: Sequelize.INTEGER,
}, {
    timestamps: false // timestamps will now be true
});

var taglib;
function DataBaseInit(cb) {
    taglib = require('taglib2')
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
        event: async (e, {name, sort}) => {
            if (!sort) {
                sort = await Musics.max('sort');
                sort = (sort || 0) + 1;
            }
            const v = await Musics.create({name, sort});
            e.returnValue = v.toJSON();
        }
    },
    {
        eventName: DataEvent.renameMusic,
        event: async (e, {id, name}) => {
            const v = await Musics.update({name}, {where: {id}});
            e.returnValue = v.toString();
        }
    },
    {
        eventName: DataEvent.listMusic,
        event: async (e, {}) => {
            // const v = await Musics.findAll({order: [['sort']]});
            const v = await sequelize.query("select id,name,sort,(select count(1) from tracks where mid=t.id) count from musics t");
            // const list = convertListJson(v[0]);
            e.returnValue = v[0];


        }
    },
    {
        eventName: DataEvent.delMusic,
        event: async (e, {id}) => {
            await Tracks.destroy({where: {mid: id}});
            const v = await Musics.destroy({where: {id}});

            e.returnValue = v;
        }
    },
    {
        eventName: DataEvent.sortMusic,
        event: async (e, {id, value, orderby}) => {
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
                result = _.sumBy(list, (n) => n.sort) / 2;
            }
            await Musics.update({sort: result}, {where: {id}});
            e.returnValue = true;
        }
    },
    {
        eventName: DataEvent.listTrack,
        event: async (e, {mid}) => {
            const v = await Tracks.findAll({
                where: {
                    mid
                }
            });

            e.returnValue = convertListJson(v);


        }

    },
    {
        eventName: DataEvent.addTrack,
        event: (e, {files, i, mid}) => {

            if (i == files.length) {
                e.sender.send(DataEvent.importDialog, {open: false});
                e.sender.send(DataEvent.finishTrack, {id: mid});
                return;
            }


            const file = files[i];
            e.sender.send(DataEvent.importDialog, {name: file, max: files.length, value: (i + 1), open: true});

            const tags = taglib.readTagsSync(file);

            const m = {
                name: path.basename(file, ".mp3"),
                path: file,
                length: tags.length,
                size: filesize(fs.statSync(file).size),
                mid,
                times: 0
            }
            // const v = await Tracks.create(m)
            Tracks.create(m).then(() => {
                e.sender.send(DataEvent.nextTrack, {
                    files, i: (i + 1), mid
                })
                ;
            })

        }
    },
    {
        eventName: DataEvent.delTrack,
        event: async (e, {id}) => {
            const v = await Tracks.destroy({where: {id}});
            e.returnValue = v;
        }
    },
    {
        eventName: DataEvent.moveTrack,
        event: async (e, {id, mid}) => {
            const v = await Tracks.update({mid}, {where: {id}});
            e.returnValue = v;
        }
    },
    {
        eventName: DataEvent.searchTrack,
        event: async (e, {name, mid}) => {

            const where = name ? {
                name: {
                    $like: `%${name}%`,
                }
            } : {
                mid
            }

            const v = await Tracks.findAll({
                where
            });
            e.returnValue = convertListJson(v);

        }
    },
    {
        eventName: DataEvent.increaseTrack,
        event: (e, {id, times}) => {
            Tracks.update({times}, {where: {id}});
        }
    }

]

BindDataBaseEvent(DataBaseEventFuncList);

module.exports = {
    DataBaseInit, Musics,
};