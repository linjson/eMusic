import React, {Component} from 'react';
import {
    Subheader, List, ListItem,
    Divider, IconButton, IconMenu,
    MenuItem, Menu, TextField,
    Dialog, LinearProgress
} from 'material-ui';
import {connect} from 'react-redux';
const ipc = require('electron').ipcRenderer;
const {OpenFileDialog} = require('../ipc/FileDialogIPC');
const action = require('./action/a_music');
import {AppEventName} from '../ipc/EventNameConfig';

class GroupName extends Component {

    static propTypes = {
        label: React.PropTypes.string,
        iconClick: React.PropTypes.func,
    }

    render() {

        let icon = this.props.iconClassName;

        return (
            <div style={styles.subheader}>
                <div style={styles.subheader_label}>{this.props.label}</div>
                <IconButton iconClassName={icon} onTouchTap={this.props.iconClick}/>
            </div>
        );
    }
}

class MusicMenu extends Component {

    static propTypes = {
        importMulti: React.PropTypes.func,
        importFiles: React.PropTypes.func,
        rename: React.PropTypes.func,
        moveUp: React.PropTypes.func,
        moveDown: React.PropTypes.func,
        delMusic: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    menuClick = (e, child) => {
        const value = child.props.value;
        if (!this.props.data) {
            return;
        }
        let {id} = this.props.data;
        if (value == 2) {
            this.props.importFiles && this.props.importFiles(id);
        } else if (value == 3) {
            this.props.rename && this.props.rename(id);
        } else if (value == 4) {
            this.props.moveUp && this.props.moveUp(id);
        } else if (value == 5) {
            this.props.moveDown && this.props.moveDown(id);
        } else if (value == 6) {
            this.props.delMusic && this.props.delMusic(id);
        }
    }


    render() {
        const iconButtonElement = (
            <IconButton
                iconClassName={"icon_chevron_right"}
            />
        )

        return (<IconMenu iconButtonElement={iconButtonElement}
                          listStyle={{paddingTop: 0, paddingBottom: 0}}
                          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                          desktop={true}
                          onItemTouchTap={this.menuClick}
            >
                <MenuItem value="2">导入文件(夹)</MenuItem>
                <MenuItem value="3">重命名</MenuItem>
                <MenuItem value="4">上移</MenuItem>
                <MenuItem value="5">下移</MenuItem>
                <MenuItem value="6">删除</MenuItem>
            </IconMenu>
        )
    }
}

class MusicItem extends Component {
    static propTypes = {
        data: React.PropTypes.object,
        selectId: React.PropTypes.number,
        renameMusic: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        importFiles: React.PropTypes.func,
    }

    state = {
        edit: false
    }

    showInput = () => {
        this.setState({edit: true});
    }

    hideInput = () => {
        this.setState({edit: false});
    }

    inputKeyDown = (e) => {
        let {keyCode} = e;

        if (keyCode == 13) {
            let {data} = this.props;
            this.props.renameMusic && this.props.renameMusic(data.id, e.target.value)
            this.hideInput();
        } else if (keyCode == 27) {
            this.hideInput();
        }


    }

    moveDown = () => {
        let {data} = this.props;

        let {id, sort} = data;
        this.props.sortMusic && this.props.sortMusic(id, sort, "down");

    }

    moveUp = () => {
        let {data} = this.props;
        let {id, sort} = data;
        this.props.sortMusic && this.props.sortMusic(id, sort, "up");

    }

    itemClick = () => {
        let {data} = this.props;
        this.props.onItemClick && this.props.onItemClick(data);
    }

    importFiles = (id) => {
        this.props.importFiles && this.props.importFiles(id);
    }

    render() {
        let {edit} = this.state;
        let {data, selectId} = this.props;
        let v = null;
        if (edit) {
            v = <TextField inputStyle={styles.editInput}
                           name={"name" + data.id}
                           defaultValue={data.name}
                           underlineShow={false}
                           rowsMax={1}
                           autoFocus={true}
                           onKeyDown={this.inputKeyDown}
                           onBlur={this.hideInput}/>
        } else {
            const selectColor = data.id == selectId ? {backgroundColor: "#dcdcdc"} : null;
            const text = `${data.name}(${data.count})`

            const el = <div><MusicMenu data={data}
                                       delMusic={this.props.delMusic}
                                       moveDown={this.moveDown}
                                       moveUp={this.moveUp}
                                       importFiles={this.importFiles}
                                       rename={this.showInput}/>
            </div>;
            v = <ListItem style={selectColor} primaryText={text} rightIconButton={el}
                          onClick={this.itemClick}/>;
        }


        return <div>
            {v}
            <Divider />
        </div>
    }
}


class MusicList extends Component {

    static propTypes = {
        addMusic: React.PropTypes.func,
        delMusic: React.PropTypes.func,
        selectMusic: React.PropTypes.func,
        musicList: React.PropTypes.object,
        importTrack: React.PropTypes.func,
        sortMusic: React.PropTypes.func,
        renameMusic: React.PropTypes.func,
        listMusic: React.PropTypes.func,
    }

    addMusic = () => {
        this.props.addMusic();
    }

    delMusic = (id) => {
        this.props.delMusic(id);
    }

    renameMusic = (id, name) => {
        this.props.renameMusic(id, name);
    }

    sortMusic = (id, value, orderby) => {
        this.props.sortMusic(id, value, orderby)
    }

    itemClick = (data) => {
        this.props.selectMusic(data.id);
    }
    importFiles = (id) => {
        ipc.send(OpenFileDialog, {mid: id});
    }

    componentDidMount() {
        let {musicList} = this.props;
        if (musicList.list && musicList.list.length != 0) {
            this.props.selectMusic(musicList.list[0].id);
        }


        ipc.on(AppEventName.finishTrack, (e, {id}) => {
            this.props.selectMusic(id);
            this.props.listMusic();
        });

        ipc.on(OpenFileDialog, (e, {files,mid}) => {
            if (files) {
                this.props.importTrack(files, mid);
            }
        })
    }

    renderItems() {
        let {musicList, selectMusicId} = this.props;
        if (!musicList) {
            return null;
        }
        return musicList.list.map(n => {
            return <MusicItem key={n.id}
                              data={n}
                              selectId={selectMusicId}
                              delMusic={this.delMusic}
                              sortMusic={this.sortMusic}
                              renameMusic={this.renameMusic}
                              onItemClick={this.itemClick}
                              importFiles={this.importFiles}
            />
        });


    }


    render() {


        return (
            <List style={{backgroundColor: 'white'}}>
                <Subheader><GroupName label="全部" iconClassName={"icon_add"} iconClick={this.addMusic}/></Subheader>
                {this.renderItems()}
            </List>
        );
    }
}


class ImportDialog extends Component {
    static propTypes = {
        dialog: React.PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            dialog: {
                open: false,
            },
        }
    }

    componentDidMount() {

        let self = this;
        ipc.on(AppEventName.importDialog, (e, params) => {
            self.setState({dialog: params});
        })

    }


    render() {

        let {dialog} = this.state;

        let {open, max, value, name} = dialog;
        return <Dialog
            title="正在导入列表"
            modal={false}
            open={open}
        >
            <div>{name}</div>
            <LinearProgress style={styles.progress} mode="determinate" max={max} value={value}/>
            <div style={styles.dialogtext}>{value}/{max}</div>
        </Dialog>
    }
}


class LeftView extends Component {
    render() {
        let ML = connect(mapStateToProps, mapActionToProps)(MusicList);
        let D = ImportDialog;
        return <div>
            <ML />
            <D />
        </div>
    }
}


function mapStateToProps(state) {
    return {
        musicList: state.musicList,
        selectMusicId: state.selectMusicId,
    }
}

function mapActionToProps(dispatch) {
    return {
        addMusic: () => {
            dispatch(action.addMusic())
        },
        delMusic: (id) => {
            dispatch(action.delMusic(id))
        },
        renameMusic: (id, name) => {
            dispatch(action.renameMusic(id, name))
        },
        sortMusic: (id, value, orderby) => {
            dispatch(action.sortMusic(id, value, orderby))
        },
        selectMusic: (id) => {
            dispatch(action.selectMusic(id));
        },
        importTrack: (files, mid) => {
            dispatch(action.importTrack(files, mid));
        },
        showTrackDialog: (dialog) => {
            dispatch(action.showTrackDialog(dialog));
        },
        listMusic: () => {
            dispatch(action.listMusic());
        }

    }
}


const styles = {
    subheader: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
    },

    subheader_label: {
        flex: 1,
    },
    editInput: {
        color: '#33aeff',
        paddingLeft: 15,
        paddingRight: 15,
    },
    dialogtext: {
        textAlign: 'right',
    },
    progress: {
        marginTop: 5,
        marginBottom: 5
    },

}

module.exports = LeftView;