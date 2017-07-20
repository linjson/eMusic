/**
 * Created by ljs on 2017/3/30.
 */
require('sqlite3');
const {sumBy} = require('./Utils');
const ipcMain = require('electron').ipcMain
const {DataEvent} = require('./DataBaseIPCConfig')

const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const os = require('os')
var dbFile = path.join(os.tmpdir(), "emusic.sqlite3");
console.log("==>",os.tmpdir())
var mp3Length = require('mp3Length');
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
    size: Sequelize.FLOAT,
    times: Sequelize.INTEGER,
    mid: Sequelize.INTEGER,
}, {
    timestamps: false // timestamps will now be true
});


function DataBaseInit(cb) {

    sequelize.sync().then(cb).catch(e => {
        console.log("==>", e)
    })
}

function BindDataBaseEvent(eventList) {
    eventList.forEach((n) => {
        ipcMain.on(n.eventName, (e, param) => {
            n.event(e, param);
        })
    })

}

function convertListJson(list) {
    return list.map(n => n.toJSON());
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
            const v = await sequelize.query("select id,name,sort,(select count(1) from tracks where mid=t.id) count from musics t order by sort");
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
                result = sumBy(list, (n) => n.sort) / 2;
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
        event: (e, {files, mid}) => {


            let list = files.map(file => {
                return () => new Promise((r, s) => {

                    fs.stat(file, (e, stats) => {
                        mp3Length(file, function (err, duration) {
                            if (err) return console.log("解析出错", err.message);
                            const m = {
                                name: path.basename(file, ".mp3"),
                                path: file,
                                length: duration,
                                size: stats.size,
                                mid,
                                times: 0
                            }
                            Tracks.create(m).then(v => r(m));
                        });
                    })

                })
            })

            let no = 0;
            let size = list.length;
            list.reduce((chain, fn) => {
                return chain.then(() => fn())
                    .then(t => {
                        e.sender.send(DataEvent.importDialog, {name: t.path, max: size, value: (no + 1), open: true});
                        no++;
                    });
            }, Promise.resolve()).then(() => {
                e.sender.send(DataEvent.importDialog, {open: false});
                e.sender.send(DataEvent.finishTrack, {id: mid});
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