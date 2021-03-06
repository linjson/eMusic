import {AutoSizer, Column, SortDirection, Table} from "react-virtualized";
import React, {Component} from 'react';

import {
    IconButton,
    IconMenu,
    MenuItem,
    FontIcon,
    Dialog,
    FlatButton,
} from 'material-ui';
import {connect} from 'react-redux';
import action from "./action/a_music";
import appAction from "./action/a_appconfig";
import {formatDate} from "./utils";
import filesize from "filesize";

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
        const list = musicList.list.filter(n => n.id != data.mid);

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
        const moveItems = this.renderMenuItems();
        return (<IconMenu iconButtonElement={iconButtonElement}
                          listStyle={{paddingTop: 0, paddingBottom: 0}}
                          targetOrigin={{horizontal: 'left', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                          desktop={true}
                          onItemTouchTap={this.menuClick}
            >
                {moveItems.length > 0 && <MenuItem value="0"
                                                   rightIcon={moveIcon}
                                                   menuItems={moveItems}>移动</MenuItem>}
                <MenuItem value="1">移出列表清单</MenuItem>
                <MenuItem value="2">删除本地文件</MenuItem>
            </IconMenu>
        )
    }
}


const TrackMenuWrapper = connect(mapStateToMenuProps)(TrackMenu);

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
        sortTrack: React.PropTypes.func,
        playControl: React.PropTypes.func,
    }

    state = {
        ask: false,
        askData: null,
        sortBy: 'times',
        sortDirection: SortDirection.ASC,
    }

    constructor(props) {
        super(props);
    }

    _play = (data, no) => {
        let {trackSelect, appConfig: {play}} = this.props;
        if (trackSelect && play && trackSelect.trackId == data.id) {
            this.props.playControl(false);
            return;
        }


        this.props.playControl(true);
        if(trackSelect.trackId != data.id) {
            this.props.selectTrack(this.props.trackList.list, no, data.id);
        }
    }

    _onItemDelete = (n) => {
        this.props.delTrack(this.props.trackList.list, n, false);
    }

    _onItemFileDelete = (n) => {
        this.setState({ask: true, askData: n});
    }

    _onItemMove = (data, mid) => {
        this.props.moveTrack(this.props.trackList.list, data, mid);
    }

    _askConfirm = (n) => {
        this.props.delTrack(this.props.trackList.list, n, true);
        this.setState({ask: false, askData: null});
    }

    _askCancle = () => {
        this.setState({ask: false, askData: null});
    }

    _noRowsRenderer = () => {
        return (
            <div style={{paddingTop: 30, textAlign: 'center'}}>
                暂无曲目
            </div>
        )
    }

    _rowClassName = ({index}) => {
        if (index < 0) {
            return 'trackHeaderRow';
        }
        return 'trackItemRow'
    }

    _sort = ({sortBy, sortDirection}) => {
        this.props.sortTrack(sortBy, sortDirection.toLowerCase());
        this.setState({sortBy, sortDirection});
    }

    _renderPlayItem = ({rowData, rowIndex}) => {
        let tap = () => {
            this._play(rowData, rowIndex);
        }

        let {trackSelect, appConfig} = this.props;
        let trackId = -1;
        if (trackSelect) {
            trackId = trackSelect.trackId;
        }


        let cls = appConfig.play && trackId == rowData.id ? "icon_pause_item" : "icon_play_item";
        return <IconButton iconClassName={cls} onTouchTap={tap}/>
    }

    _renderCurrentItem = ({rowData, rowIndex}) => {
        let {trackSelect} = this.props;
        let trackId = -1;
        if (trackSelect) {
            trackId = trackSelect.trackId;
        }
        let cls = trackId == rowData.id ? "trackItemColumnSelect" : "";
        return <div className={cls} style={{height: '100%'}}></div>
    }

    _rowDoubleClick=({ event, index, rowData })=>{
        let {trackSelect, appConfig: {play}} = this.props;


        if(!play||rowData.id!=trackSelect.trackId){
            this.props.playControl(true);
            this.props.selectTrack(this.props.trackList.list, index, rowData.id);
        }

    }

    render() {
        let {sortBy, sortDirection} = this.state;

        let {list} = this.props.trackList;
        let trackSize = list ? list.length : 0;

        let v = (<div style={{display: 'flex', flex: 1,}}>
                <AutoSizer>
                    {({width, height}) => {
                        return (
                            <Table
                                width={width}
                                height={height - 1}
                                headerHeight={30}
                                rowHeight={40}
                                rowCount={trackSize}
                                noRowsRenderer={this._noRowsRenderer}
                                rowClassName={this._rowClassName}
                                rowGetter={({index}) => list[index]}
                                sort={this._sort}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                onRowDoubleClick={this._rowDoubleClick}
                            >
                                <Column
                                    width={2}
                                    className={'trackItemColumn'}
                                    dataKey={''}
                                    disableSort={true}
                                    cellRenderer={this._renderCurrentItem}
                                />
                                <Column
                                    width={50}
                                    dataKey={''}
                                    disableSort={true}
                                    cellRenderer={this._renderPlayItem}
                                />
                                <Column
                                    label='序号'
                                    width={50}
                                    dataKey={'id'}
                                    disableSort={true}
                                    className={'trackNoColumns'}
                                    headerClassName={'trackNoColumns'}
                                    cellRenderer={({rowIndex}) => {
                                        return rowIndex + 1;
                                    }}
                                />
                                <Column
                                    label='曲目'
                                    dataKey='name'
                                    width={100}
                                    disableSort={true}
                                    flexGrow={1}
                                />
                                <Column
                                    label='时长'
                                    width={50}
                                    disableSort={false}
                                    dataKey='length'
                                    cellDataGetter={({rowData}) => {
                                        return formatDate(rowData.length)
                                    }}
                                />
                                <Column
                                    label='大小'
                                    width={70}
                                    dataKey='size'
                                    disableSort={false}
                                    cellDataGetter={({rowData}) => {
                                        return filesize(rowData.size)
                                    }}
                                />
                                <Column
                                    label='次数'
                                    width={50}
                                    disableSort={false}
                                    dataKey='times'
                                    className={'trackTimesColumns'}
                                    headerClassName={'trackTimesColumns'}
                                />
                                <Column
                                    label='操作'
                                    width={50}
                                    dataKey={''}
                                    headerClassName={'trackOpColumns'}
                                    className={'trackOpColumns'}
                                    disableSort={true}
                                    cellRenderer={({rowData}) => {
                                        return <TrackMenuWrapper data={rowData}
                                                                 onDeleteTrack={this._onItemDelete}
                                                                 onDeleteFile={this._onItemFileDelete}
                                                                 onMoveTrack={this._onItemMove}

                                        />

                                    }}
                                />

                            </Table>
                        )
                    }}
                </AutoSizer>

                <AskDeletFileDialog open={this.state.ask}
                                    data={this.state.askData}
                                    onConfirm={this._askConfirm}
                                    onCancle={this._askCancle}
                />
            </div>
        );

        return v;
    }
}


function mapStateToProps(state, props) {
    return {
        trackList: state.trackList,
        trackSelect: state.trackSelect,
        appConfig: state.appConfig,
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
        delTrack: (oldlist, data, removeFile) => {
            dispatch(action.delTrack(oldlist, data, removeFile))
        },
        moveTrack: (oldlist, data, mid) => {
            dispatch(action.moveTrack(oldlist, data, mid))
        },
        sortTrack: (sortBy, sortDirection) => {
            dispatch(action.sortTrack(sortBy, sortDirection));
        },
        playControl: (value) => {
            dispatch(appAction.playControl(value));
        }

    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackList);