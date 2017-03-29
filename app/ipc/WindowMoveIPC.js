const StartMove = 'win_StartMove';
const OnMove = 'win_OnMove';
const ipcMain = require('electron').ipcMain;
function moveApp(app) {

    this.pos = {};

    this.init = () => {
        let p = app.getPosition();
        this.pos = {x: p[0], y: p[1]};
    };
    this.init();
    ipcMain.on(StartMove, (e, param) => {
        this.init();
        e.returnValue = true;
    });


    ipcMain.on(OnMove, (e, {offsetX, offsetY}) => {

        app.setPosition(this.pos.x + offsetX, this.pos.y + offsetY);

    })
}


module.exports = {
    moveApp,
    StartMove,
    OnMove
}