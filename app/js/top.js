/**
 * Created by ljs on 2017/3/21.
 */


import React, {Component} from 'react';
import {AppBar, TextField, IconButton} from 'material-ui';

const {StartMove, OnMove}=require('../ipc/WindowMoveIPC');
const ipc = require('electron').ipcRenderer


class AppTop extends Component {
    constructor(props) {
        super(props);
        this.startMove = false;
    }

    mouseDown = ({nativeEvent}) => {
        this.startXY = {x: nativeEvent.screenX, y: nativeEvent.screenY};
        this.startMove = ipc.sendSync(StartMove);
    }
    mouseMove = ({nativeEvent}) => {
        if (!this.startMove) {
            return;
        }

        let offset = {
            offsetX: nativeEvent.screenX - this.startXY.x,
            offsetY: nativeEvent.screenY - this.startXY.y,
        }


        ipc.send(OnMove, offset);
    }
    mouseUp = (e) => {
        this.startMove = false;
    }

    createSearch() {

        return <TextField id={"search"}
                          underlineShow={false}
                          hintText={"搜索"}
                          rowsMax={1}
                          hintStyle={styles.hintStyle}
                          inputStyle={styles.searchStyle}/>;
    }

    render() {
        return <AppBar
            title="eMusic"
            onMouseDown={this.mouseDown}
            onMouseMove={this.mouseMove}
            onMouseUp={this.mouseUp}
            onMouseOut={this.mouseUp}
            showMenuIconButton={false}
            iconElementRight={this.createSearch()}

        />
    }
}


const styles = {
    searchStyle: {
        color: 'white',
        textAlign: 'right',
        fontSize:15,
    },

    hintStyle: {
        color: 'white',
        fontSize:15,
        right:0,
    }
}


module.exports = AppTop;