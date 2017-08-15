import action from "./action/a_music";
import {OpenFileDialog} from "../ipc/FileDialogIPC";
import {ipcRenderer as ipc} from "electron";
import React, {Component} from 'react';
import _ from 'lodash';
import {
    Subheader, List, ListItem,
    Divider, IconButton, IconMenu,
    MenuItem, Menu, TextField,
    Dialog, LinearProgress
} from 'material-ui';
import {connect} from 'react-redux';
import {SortablePane, Pane} from './component/react-sortable-pane';
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

        let {importMulti,importFiles,rename,delMusic,data,...other}=this.props;
        return (<IconMenu iconButtonElement={iconButtonElement}
                          listStyle={{paddingTop: 0, paddingBottom: 0}}
                          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                          desktop={true}
                          onItemTouchTap={this.menuClick}
                          {...other}
            >
                <MenuItem value="2">导入文件(夹)</MenuItem>
                <MenuItem value="3">重命名</MenuItem>
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

            let el = <MusicMenu data={data}
                                       delMusic={this.props.delMusic}
                                       importFiles={this.importFiles}
                                       rename={this.showInput}/>
            v = <ListItem style={selectColor} primaryText={text} rightIconButton={el}
                          onTouchTap={this.itemClick}/>;
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
        importMusic: React.PropTypes.func,
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
        if (this.props.selectMusicId > 0) {
            return;
        }
        let {musicList} = this.props;
        if (musicList.list && musicList.list.length != 0) {
            this.props.selectMusic(musicList.list[0].id);
        }


        ipc.on(AppEventName.finishTrack, (e, {id,count}) => {
            this.props.selectMusic(id);
            this.props.importMusic(id,count);
        });

        ipc.on(OpenFileDialog, (e, {files, mid}) => {
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
            return <Pane key={n.id} height={48} width={'100%'} id={n.id}
                         isResizable={{x: false, y: false, xy: false}}
            ><MusicItem
                data={n}
                selectId={selectMusicId}
                delMusic={this.delMusic}
                sortMusic={this.sortMusic}
                renameMusic={this.renameMusic}
                onItemClick={this.itemClick}
                importFiles={this.importFiles}
            /></Pane>
        });


    }

    _listDragStop = (e, id, panes) => {
        let preIndex, nextIndex;
        let musiclist = _.cloneDeep(this.props.musicList.list);
        let targetIndex = panes.findIndex((n, i) => {
            return n.id == id;
        });

        let oldIndex = musiclist.findIndex((n, i) => {
            return n.id == id;
        })

        if (oldIndex == targetIndex) {
            return;
        }

        preIndex = targetIndex > 0 ? targetIndex - 1 : 0;
        nextIndex = targetIndex < panes.length - 1 ? targetIndex + 1 : panes.length - 1;

        let sort = 0;
        if (targetIndex == 0) {
            let nextObj = musiclist.find((n) => {
                return n.id == panes[nextIndex].id;
            })
            sort = nextObj.sort - 1;
        } else if (targetIndex == panes.length - 1) {
            let preObj = musiclist.find((n) => {
                return n.id == panes[preIndex].id;
            })
            sort = preObj.sort + 1;
        } else {
            let nextObj = musiclist.find((n) => {
                return n.id == panes[nextIndex].id;
            })
            let preObj = musiclist.find((n) => {
                return n.id == panes[preIndex].id;
            })
            sort = (nextObj.sort + preObj.sort) / 2;
        }

        this.props.sortMusic(id, sort);


    }


    render() {

        return (
            <div style={{backgroundColor: 'white'}}>
                <Subheader><GroupName label="全部" iconClassName={"icon_add"} iconClick={this.addMusic}/></Subheader>
                <SortablePane key="list" direction="vertical" onDragStop={this._listDragStop}>
                    {this.renderItems()}
                </SortablePane>
            </div>
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
        sortMusic: (id, value) => {
            dispatch(action.sortMusic(id, value))
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
        importMusic: (id,count) => {
            dispatch(action.importMusic(id,count));
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