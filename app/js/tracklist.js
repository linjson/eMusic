import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    IconButton,
    IconMenu,
    MenuItem,
    FontIcon,
    Dialog,
    FlatButton,
} from 'material-ui';
import {connect} from 'react-redux';
import action from "./action/a_music";
import {formatDate} from "./utils";

class TrackMenu extends Component {

    static propTypes = {
        musicList: React.PropTypes.object,
        data: React.PropTypes.object,
        onDeleteTrack: React.PropTypes.func,
        onDeleteFile: React.PropTypes.func,
        onMoveTrack: React.PropTypes.func,
    }

    menuClick = (e, child) => {
        const value = child.props.value;

        const {data} = this.props;

        if (value == 1) {
            this.props.onDeleteTrack && this.props.onDeleteTrack(data);
        } else if (value == 2) {
            this.props.onDeleteFile && this.props.onDeleteFile(data);
        }
    }

    subMeunClick = (n) => {
        const {data} = this.props;
        this.props.onMoveTrack && this.props.onMoveTrack(data, n.id);
    }

    renderMenuItems = () => {
        let {musicList} = this.props;
        if (!musicList.list) {
            return;
        }
        const {data} = this.props;
        const list=musicList.list.filter(n=>n.id!=data.mid);

        return list.map((n) => {
            return <MenuItem value={n.id} onTouchTap={() => {
                this.subMeunClick(n)
            }}>{n.name}</MenuItem>
        });

    }

    render() {
        const iconButtonElement = (
            <IconButton
                iconClassName={"icon_chevron_right"}
            />
        )
        const moveIcon = <FontIcon className="icon_chevron_right" color={'black'}/>
        return (<IconMenu iconButtonElement={iconButtonElement}
                          listStyle={{paddingTop: 0, paddingBottom: 0}}
                          targetOrigin={{horizontal: 'left', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                          desktop={true}
                          onItemTouchTap={this.menuClick}
            >
                <MenuItem value="0"
                          rightIcon={moveIcon}
                          menuItems={this.renderMenuItems()}>移动</MenuItem>
                <MenuItem value="1">移出列表清单</MenuItem>
                <MenuItem value="2">删除本地文件</MenuItem>
            </IconMenu>
        )
    }
}


const TrackMenuWrapper = connect(mapStateToMenuProps)(TrackMenu);

class TrackItem extends Component {

    static propTypes = {
        no: React.PropTypes.number,
        data: React.PropTypes.object,
        onPlay: React.PropTypes.func,
        isCurrentPlay: React.PropTypes.bool,
        onDeleteTrack: React.PropTypes.func,
        onDeleteFile: React.PropTypes.func,
        onMoveTrack: React.PropTypes.func,
    }

    _onPlay = () => {
        this.props.onPlay && this.props.onPlay(this.props.data, this.props.no);
    }

    render() {
        let {no, data: n, isCurrentPlay} = this.props;
        let color = isCurrentPlay ? {backgroundColor: '#00BCD4'} : {};
        return <TableRow>
            <TableRowColumn style={{...styles.col_current, ...color}}></TableRowColumn>
            <TableRowColumn style={styles.col_no}>{(no + 1)}</TableRowColumn>
            <TableRowColumn style={styles.col_title}><IconButton
                iconClassName={"icon_play_item"} onTouchTap={this._onPlay}
            />{n.name}</TableRowColumn>
            <TableRowColumn style={styles.col_length}>{formatDate(n.length)}</TableRowColumn>
            <TableRowColumn style={styles.col_size}>{n.size}</TableRowColumn>
            <TableRowColumn style={styles.col_times}>{n.times}</TableRowColumn>
            <TableRowColumn style={styles.col_op_content}>
                <TrackMenuWrapper data={n}
                                  onDeleteTrack={this.props.onDeleteTrack}
                                  onDeleteFile={this.props.onDeleteFile}
                                  onMoveTrack={this.props.onMoveTrack}
                />
            </TableRowColumn>
        </TableRow>
    }

}

class AskDeletFileDialog extends Component {


    static propTypes = {
        open: React.PropTypes.bool,
        data: React.PropTypes.object,
        onConfirm: React.PropTypes.func,
        onCancle: React.PropTypes.func,
    }

    _handleClose = () => {
        this.props.onCancle && this.props.onCancle();
    }

    _handleYes = () => {
        this.props.onConfirm && this.props.onConfirm(this.props.data);
    }

    render() {

        let {name, path} = this.props.data || {};

        const actions = [
            <FlatButton
                label="取消"
                keyboardFocused={true}
                onTouchTap={this._handleClose}
            />,
            <FlatButton
                label="删除"
                primary={true}
                onTouchTap={this._handleYes}
            />,
        ];

        const title = `删除<${name}>`
        return (
            <Dialog
                title={title}
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this._handleClose}
            >
                <div>是否删除文件:</div>
                <div>{path}</div>


            </Dialog>
        );
    }

}

class TrackList extends Component {

    static propTypes = {
        trackList: React.PropTypes.object,
        selectTrack: React.PropTypes.func,
        trackSelect: React.PropTypes.object,
        delTrack: React.PropTypes.func,
        moveTrack: React.PropTypes.func,
    }

    state = {
        ask: false,
        askData: null,
    }

    _play = (data, no) => {
        this.props.selectTrack(this.props.trackList.list, no, data.id);
    }

    _onItemDelete = (n) => {
        this.props.delTrack(n, false);
    }

    _onItemFileDelete = (n) => {
        this.setState({ask: true, askData: n});
    }

    _onItemMove = (data, mid) => {
        this.props.moveTrack(data, mid);
    }

    _renderItems() {
        let {trackList, trackSelect} = this.props;

        if (!trackList.list || trackList.list.length == 0) {
            return <TableRow>
                <TableRowColumn colSpan={6} style={{textAlign: 'center'}}>暂无曲目</TableRowColumn>
            </TableRow>;
        }

        let trackId = -1;
        if (trackSelect) {
            trackId = trackSelect.trackId;
        }

        return trackList.list.map((n, i) => {
                return <TrackItem key={"track" + i}
                                  no={i}
                                  data={n}
                                  onPlay={this._play}
                                  isCurrentPlay={n.id == trackId}
                                  onDeleteTrack={this._onItemDelete}
                                  onDeleteFile={this._onItemFileDelete}
                                  onMoveTrack={this._onItemMove}
                />
            }
        )
    }

    _askConfirm = (n) => {
        this.props.delTrack(n, true);
        this.setState({ask: false, askData: null});
    }

    _askCancle = () => {
        this.setState({ask: false, askData: null});
    }

    render() {
        return (<div style={{display: 'flex'}}>
                <Table
                    wrapperStyle={{display: 'flex', flexDirection: 'column', flex: 1,}}
                    bodyStyle={{flex: 1}}
                    selectable={true}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={styles.col_current}></TableHeaderColumn>
                            <TableHeaderColumn style={styles.col_no}>序号</TableHeaderColumn>
                            <TableHeaderColumn>曲目</TableHeaderColumn>
                            <TableHeaderColumn style={styles.col_length}>时长</TableHeaderColumn>
                            <TableHeaderColumn style={styles.col_size}>大小</TableHeaderColumn>
                            <TableHeaderColumn style={styles.col_times}>次数</TableHeaderColumn>
                            <TableHeaderColumn style={styles.col_op}>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this._renderItems()}
                    </TableBody>
                </Table>
                <AskDeletFileDialog open={this.state.ask}
                                    data={this.state.askData}
                                    onConfirm={this._askConfirm}
                                    onCancle={this._askCancle}
                />
            </div>
        );
    }
}

const styles = {
    col_current: {
        width: 2,
        padding: 0,
    },
    col_no: {
        width: 10,
    },
    col_size: {
        width: 50,
    },
    col_length: {
        width: 35,
    },
    col_op: {
        padding: 0,
        width: 50,
    },
    col_op_content: {
        width: 50,
        padding: 0,
    },
    col_times: {
        width: 10,
    },
    col_title: {
        alignItems: 'center',
        display: 'flex',
    },
}


function mapStateToProps(state, props) {
    return {
        trackList: state.trackList,
        trackSelect: state.trackSelect,
    }
}

function mapStateToMenuProps(state, props) {
    return {
        musicList: state.musicList,

    }
}

function mapActionToProps(dispatch, props) {
    return {
        selectTrack: (list, index, trackId) => {
            dispatch(action.selectTrack(list, index, trackId))
        },
        delTrack: (data, removeFile) => {
            dispatch(action.delTrack(data, removeFile))
        },
        moveTrack: (data, mid) => {
            dispatch(action.moveTrack(data, mid))
        }

    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackList);