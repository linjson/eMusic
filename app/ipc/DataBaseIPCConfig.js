const {keymirror} = require('./Utils');
const DataEvent = keymirror({
    addMusic: null,
    renameMusic: null,
    sortMusic: null,
    listMusic: null,
    delMusic: null,
    selectMusic: null,
    listTrack: null,
    addTrack: null,
    importDialog: null,
    // nextTrack: null,
    finishTrack: null,
    delTrack: null,
    moveTrack: null,
    selectTrack: null,
    searchTrack: null,
    increaseTrack: null,
})


module.exports = {DataEvent};