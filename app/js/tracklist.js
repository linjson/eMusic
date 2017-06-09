import React, {Component} from 'react';
import {
    Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, IconButton
} from 'material-ui';
import {connect} from 'react-redux';
import action from "./action/a_music";
import {formatDate} from "./utils";

class TrackItem extends Component {

    static propTypes = {
        no: React.PropTypes.number,
        data: React.PropTypes.object,
        onPlay: React.PropTypes.func,
        isCurrentPlay: React.PropTypes.bool,
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
            <TableRowColumn style={styles.col_op}>{n.times}</TableRowColumn>
        </TableRow>
    }

}

class TrackList extends Component {

    static propTypes = {
        trackList: React.PropTypes.object,
        selectTrack: React.PropTypes.func,
        trackSelect: React.PropTypes.object,
    }

    play = (data, no) => {
        this.props.selectTrack(this.props.trackList.list, no, this.props.trackList.mid);
    }

    renderItems() {
        let {trackList, trackSelect} = this.props;

        if (!trackList.list || trackList.list.length == 0) {
            return <TableRow>
                <TableRowColumn colSpan={6} style={{textAlign: 'center'}}>暂无曲目</TableRowColumn>
            </TableRow>;
        }

        let currentIndex = -1;
        if (trackSelect && trackSelect.mid == trackList.mid) {

            currentIndex = trackSelect.currentIndex;
        }

        return trackList.list.map((n, i) => {
                return <TrackItem key={"track" + i} no={i} data={n} onPlay={this.play} isCurrentPlay={i == currentIndex}/>
            }
        )
    }

    render() {
        return (
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
                    {this.renderItems()}
                </TableBody>
            </Table>
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
        width: 10,
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

function mapActionToProps(dispatch, props) {
    return {
        selectTrack: (list, index, mid) => {
            dispatch(action.selectTrack(list, index, mid))
        }
    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackList);