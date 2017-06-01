import React, {Component} from 'react';
import {
    Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, IconButton
} from 'material-ui';
import {connect} from 'react-redux';
import action from "./action/a_music";


class TrackItem extends Component {

    static propTypes = {
        no: React.PropTypes.number,
        data: React.PropTypes.object,
        onPlay: React.PropTypes.func,
    }

    _onPlay = () => {
        this.props.onPlay && this.props.onPlay(this.props.data);
    }

    render() {
        let {no, data: n} = this.props;

        return <TableRow>
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
    }

    play = (data) => {
        console.log("==>", data);
        this.props.selectTrack(data);
    }

    renderItem() {
        let {trackList} = this.props;

        if (!trackList.list || trackList.list.length == 0) {
            return <TableRow>
                <TableRowColumn colSpan={5} style={{textAlign: 'center'}}>暂无曲目</TableRowColumn>
            </TableRow>;
        }


        return trackList.list.map((n, i) => {
                return <TrackItem key={"track" + i} no={i} data={n} onPlay={this.play}/>
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
                        <TableHeaderColumn style={styles.col_no}>序号</TableHeaderColumn>
                        <TableHeaderColumn>曲目</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_length}>时长</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_size}>大小</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_times}>次数</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_op}>操作</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.renderItem()}
                </TableBody>
            </Table>
        );
    }
}

const styles = {
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
    }
}

function mapActionToProps(dispatch, props) {
    return {
        selectTrack: (data) => {
            dispatch(action.selectTrack(data))
        }
    }
}


function fileZero(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num + "";
}

function formatDate(length) {
    if (!length) {
        return "";
    }

    let m = fileZero(parseInt(length / 60));
    let s = fileZero(length % 60);

    return `${m}:${s}`;

}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackList);