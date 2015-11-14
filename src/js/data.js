var Sequelize = require('sequelize');

var dbFile = "emusic.sqlite3";
var dbName = "emusic";

var sequelize = new Sequelize(dbFile, null, null, {
    dialect: 'sqlite',
    storage: dbFile
});

//sequelize.sync({
//logging: console.log
//    force: true
//});

var dataset = {
    mulu: null,
    musiclist: null,

    init(){

        this.mulu = sequelize.define('mulu', {
            name: Sequelize.STRING
        });

        this.musiclist = sequelize.define('musiclist', {
            name: Sequelize.STRING,
            muluId: Sequelize.INTEGER,
            path: Sequelize.STRING
        });

    },

    addMulu(name, func){
        this.mulu.create({name}).then(func);
    },
    getMuluListCount(func){
        this.mulu.count().then(func);
    },

    getMuluList(func){
        this.mulu.findAll().then(func);
    },
    updateMulu(id, mulu, func){
        this.mulu.update({name: mulu}, {where: {id: id}}).then(func);
    }


}


dataset.init();


module.exports = dataset;