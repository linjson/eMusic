var Sequelize = require('sequelize');

var dbFile = "emusic.sqlite3";
var dbName = "emusic";

var sequelize = new Sequelize(dbFile, null, null, {
    dialect: 'sqlite',
    storage: dbFile
});

sequelize.sync({
    //logging: console.log
//    force: true
});

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

    }
}


dataset.init();

//dataset.mulu.create({name:"test"});

dataset.mulu.findAll({where:{
    name:{
        $like:"tt"
    }
}}).then(function(e){
    console.log("a",e.length)
});