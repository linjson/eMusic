/**
 * Created by ljs on 2017/3/21.
 */


import React, {Component} from 'react';
import {AppBar, TextField, IconButton} from 'material-ui';
import {OnMove, StartMove} from "../ipc/WindowMoveIPC";
import {ipcRenderer as ipc} from "electron";
import action from './action/a_music';
import {connect} from 'react-redux';
import SearchBox from './component/react-searchbox';
class AppTop extends Component {

    static propTypes = {
        searchTrack: React.PropTypes.func,
        selectMusicId: React.PropTypes.number,
    }

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
    _onSearch = (value) => {
        this.props.searchTrack(value, this.props.selectMusicId);
    }

    createSearch() {
        return <SearchBox onSearch={this._onSearch}/>
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


function mapActionToProps(dispatch, props) {
    return {
        searchTrack: (name, mid) => {
            dispatch(action.searchTrack(name, mid))
        },
    }
}

function mapStateToProps(state, props) {
    return {
        selectMusicId: state.selectMusicId
    }
}


const styles = {
    searchStyle: {
        color: 'white',
        textAlign: 'right',
        fontSize: 15,
    },

    hintStyle: {
        color: 'white',
        fontSize: 15,
        right: 0,
    },
    textFieldStyle: {
        marginRight: 20,
    }

}


module.exports = connect(mapStateToProps, mapActionToProps)(AppTop);