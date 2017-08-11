/**
 * Created by ljs on 2017/3/30.
 */
require('sqlite3');
const {bindIPCEvent} = require('./Utils');
const electron = require('electron');
const {AppEventName} = require('./EventNameConfig')

const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
// const os = require('os')


const userDataDir = (electron.app || electron.remote.app).getPath('userData');

var dbFile = path.join(userDataDir, "emusic.sqlite3");
console.log("==>", userDataDir)
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


function convertListJson(list) {
    return list.map(n => n.toJSON());
}


const DataBaseEventFuncList = [
    {
        eventName: AppEventName.addMusic,
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
        eventName: AppEventName.renameMusic,
        event: (e, {id, name}) => {
            Musics.update({name}, {where: {id}});
        }
    },
    {
        eventName: AppEventName.listMusic,
        event: async (e, {}) => {
            // const v = await Musics.findAll({order: [['sort']]});
            const v = await sequelize.query("select id,name,sort,(select count(1) from tracks where mid=t.id) count from musics t order by sort");
            // const list = convertListJson(v[0]);
            e.returnValue = v[0];


        }
    },
    {
        eventName: AppEventName.delMusic,
        event: (e, {id}) => {
            Tracks.destroy({where: {mid: id}});
            Musics.destroy({where: {id}});

        }
    },
    {
        eventName: AppEventName.sortMusic,
        event: (e, {id, value, orderby}) => {
            // let sort = orderby == "up" ? {lt: value} : {gt: value};
            // let order = orderby == "up" ? [["sort", "desc"]] : null;
            // const v = await Musics.findAll({
            //     where: {
            //         sort
            //     }, limit: 2, order
            // });
            //
            // const list = convertListJson(v);
            // if (list.length == 0) {
            //     e.returnValue = false;
            //     return;
            // }
            // let result = 0;
            // if (list.length == 1) {
            //     result = list[0].sort + (orderby == "down" ? 1 : -1);
            // } else {
            //     result = sumBy(list, (n) => n.sort) / 2;
            // }
            Musics.update({sort: value}, {where: {id}});
            // e.returnValue = true;

        }
    },
    {
        eventName: AppEventName.listTrack,
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
        eventName: AppEventName.addTrack,
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
                        e.sender.send(AppEventName.importDialog, {
                            name: t.path,
                            max: size,
                            value: (no + 1),
                            open: true
                        });
                        no++;
                    });
            }, Promise.resolve()).then(() => {
                e.sender.send(AppEventName.importDialog, {open: false});
                e.sender.send(AppEventName.finishTrack, {id: mid});
            })

        }
    },
    {
        eventName: AppEventName.delTrack,
        event: async (e, {id}) => {
            const v = await Tracks.destroy({where: {id}});
            e.returnValue = v;
        }
    },
    {
        eventName: AppEventName.moveTrack,
        event: async (e, {id, mid}) => {
            const v = await Tracks.update({mid}, {where: {id}});
            e.returnValue = v;
        }
    },
    {
        eventName: AppEventName.searchTrack,
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
        eventName: AppEventName.increaseTrack,
        event: (e, {id, times}) => {
            Tracks.update({times}, {where: {id}});
        }
    }

]

bindIPCEvent(DataBaseEventFuncList);

module.exports = {
    DataBaseInit, Musics,
};